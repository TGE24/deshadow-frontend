import { useState, useEffect, useCallback, ReactNode } from "react";
import { useRefreshTokenMutation } from "../generated/graphql";
import { AuthContext } from "./AuthContextObject.tsx";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [refreshTokenMutation] = useRefreshTokenMutation();
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check if token is expired
	const isTokenExpired = (token: string): boolean => {
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Date.now() / 1000;
			return payload.exp < currentTime;
		} catch {
			return true;
		}
	};

	// Load tokens from localStorage on app start
	useEffect(() => {
		const initializeAuth = async () => {
			const savedAccessToken = localStorage.getItem("accessToken");
			const savedRefreshToken = localStorage.getItem("refreshToken");

			if (savedAccessToken && savedRefreshToken) {
				if (isTokenExpired(savedAccessToken)) {
					// Access token expired, try to refresh
					setRefreshToken(savedRefreshToken);
					const newAccessToken = await refreshAccessTokenInternal(
						savedRefreshToken
					);
					if (newAccessToken) {
						setAccessToken(newAccessToken);
					} else {
						// Refresh failed, clear tokens
						clearTokens();
					}
				} else {
					// Access token still valid
					setAccessToken(savedAccessToken);
					setRefreshToken(savedRefreshToken);
				}
			}
			setIsLoading(false);
		};

		initializeAuth();
	}, []);

	// Internal refresh function
	const refreshAccessTokenInternal = async (
		currentRefreshToken: string
	): Promise<string | null> => {
		const { data } = await refreshTokenMutation({
			variables: {
				refreshToken: currentRefreshToken,
			},
			onCompleted: (data) => {
				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					data.refreshToken;
				if (typeof newAccessToken === "string") {
					localStorage.setItem("accessToken", newAccessToken);
				}
				if (newRefreshToken) {
					localStorage.setItem("refreshToken", newRefreshToken);
					setRefreshToken(newRefreshToken);
				}
			},
			onError: (error) => {
				console.error("Token refresh failed:", error);
				logout();
			},
		});
		return data &&
			data.refreshToken &&
			typeof data.refreshToken.refreshToken === "string"
			? data.refreshToken.refreshToken
			: null;
	};

	// Public refresh function
	const refreshAccessToken = useCallback(async (): Promise<string | null> => {
		if (!refreshToken) return null;

		const newAccessToken = await refreshAccessTokenInternal(refreshToken);
		if (newAccessToken) {
			setAccessToken(newAccessToken);
			return newAccessToken;
		} else {
			logout();
			return null;
		}
	}, [refreshToken]);

	const login = (newAccessToken: string, newRefreshToken: string) => {
		setAccessToken(newAccessToken);
		setRefreshToken(newRefreshToken);
		localStorage.setItem("accessToken", newAccessToken);
		localStorage.setItem("refreshToken", newRefreshToken);
	};

	const clearTokens = () => {
		setAccessToken(null);
		setRefreshToken(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	const logout = useCallback(() => {
		clearTokens();
		window.location.href = "/login";
	}, []);

	// Auto-refresh token before it expires
	useEffect(() => {
		if (!accessToken) return;

		const setupTokenRefresh = () => {
			try {
				const payload = JSON.parse(atob(accessToken.split(".")[1]));
				const expirationTime = payload.exp * 1000; // Convert to milliseconds
				const currentTime = Date.now();
				const timeUntilExpiry = expirationTime - currentTime;

				// Refresh 5 minutes before expiration
				const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000); // At least 1 minute

				const timeoutId = setTimeout(() => {
					refreshAccessToken();
				}, refreshTime);

				return () => clearTimeout(timeoutId);
			} catch (error) {
				console.error("Error setting up token refresh:", error);
			}
		};

		return setupTokenRefresh();
	}, [accessToken, refreshAccessToken]);

	const isAuthenticated = !!accessToken && !isLoading;

	return (
		<AuthContext.Provider
			value={{
				accessToken,
				refreshToken,
				login,
				logout,
				refreshAccessToken,
				isAuthenticated,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
