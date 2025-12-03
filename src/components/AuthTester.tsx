import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContextObject";

const makeFakeJWT = (expSeconds: number) => {
	const header = { alg: "HS256", typ: "JWT" };
	const payload = { exp: expSeconds };

	const base64UrlEncode = (obj: unknown) => {
		const json = JSON.stringify(obj);
		// Prefer browser btoa, fallback to Buffer when available
		let b64: string;
		try {
			if (typeof btoa === "function") {
				// encodeURIComponent + unescape to properly handle UTF-8
				b64 = btoa(unescape(encodeURIComponent(json)));
			} else if (typeof Buffer !== "undefined") {
				b64 = Buffer.from(json).toString("base64");
			} else {
				b64 = "";
			}
		} catch {
			b64 = "";
		}

		return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	};

	return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.signature`;
};

const short = (s?: string | null) => (s ? `${s.slice(0, 20)}...` : "null");

const AuthTester = () => {
	const ctx = useContext(AuthContext);
	const [manualAccess, setManualAccess] = useState("");
	const [manualRefresh, setManualRefresh] = useState("");
	const [result, setResult] = useState<string | null>(null);

	if (!ctx) return null;

	const { accessToken, refreshToken, login, logout, refreshAccessToken } = ctx;

	const setTokens = () => {
		login(manualAccess, manualRefresh);
		setResult("Tokens set in context/localStorage");
	};

	const expireAccessToken = () => {
		// create an expired token (exp in the past)
		const expired = makeFakeJWT(Math.floor(Date.now() / 1000) - 60);
		// write to localStorage and update context immediately so effects run
		try {
			const currentRefresh = refreshToken || manualRefresh || null;
			login(expired, currentRefresh as string);
			setResult("Expired access token set in context/localStorage.");
		} catch {
			// fallback: just write to localStorage
			localStorage.setItem("accessToken", expired);
			setResult(
				"Expired access token written to localStorage. Reload to pick it up."
			);
		}
	};

	const callRefresh = async () => {
		setResult("Calling refresh...");
		try {
			const newToken = await refreshAccessToken();
			setResult(
				newToken
					? `Refresh succeeded: ${short(newToken)}`
					: "Refresh returned null"
			);
		} catch (err: unknown) {
			setResult(`Error: ${String(err)}`);
		}
	};

	return (
		<div className="p-4 border rounded mb-4 bg-white">
			<h4 className="font-semibold mb-2">Auth Tester (dev)</h4>
			<div className="text-sm mb-2">
				Access: <code>{short(accessToken)}</code>
			</div>
			<div className="text-sm mb-2">
				Refresh: <code>{short(refreshToken)}</code>
			</div>

			<div className="flex gap-2 mb-2">
				<input
					className="border px-2 py-1"
					placeholder="access token"
					value={manualAccess}
					onChange={(e) => setManualAccess(e.target.value)}
				/>
				<input
					className="border px-2 py-1"
					placeholder="refresh token"
					value={manualRefresh}
					onChange={(e) => setManualRefresh(e.target.value)}
				/>
				<button
					className="px-3 py-1 bg-green-600 text-white rounded"
					onClick={setTokens}
				>
					Set
				</button>
			</div>

			<div className="flex gap-2 mb-2">
				<button
					className="px-3 py-1 bg-yellow-500 text-white rounded"
					onClick={expireAccessToken}
				>
					Expire Access Token
				</button>
				<button
					className="px-3 py-1 bg-blue-600 text-white rounded"
					onClick={callRefresh}
				>
					Call Refresh
				</button>
				<button
					className="px-3 py-1 bg-gray-600 text-white rounded"
					onClick={() => {
						logout();
						setResult("Logged out");
					}}
				>
					Logout
				</button>
			</div>

			<div className="text-sm text-gray-700">Result: {result}</div>
			<div className="text-xs text-gray-400 mt-2">
				Notes: Refresh will call the backend mutation. Use a valid refresh token
				for a real refresh.
			</div>
		</div>
	);
};

export default AuthTester;
