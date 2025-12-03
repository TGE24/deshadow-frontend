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

	const clearTokens = () => {
		setAccessToken(null);
		setRefreshToken(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	const logout = useCallback(() => {
		clearTokens();
		window.location.href = "/";
	}, []);

	// Internal refresh function
	const refreshAccessTokenInternal = useCallback(
		async (currentRefreshToken: string): Promise<string | null> => {
			try {
				const { data } = await refreshTokenMutation({
					variables: {
						refreshToken: currentRefreshToken,
					},
					onError: (error) => {
						console.error("Token refresh failed:", error);
						// logout();
					},
				});

				if (data?.refreshToken) {
					const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
						data.refreshToken;

					if (newAccessToken) {
						localStorage.setItem("accessToken", newAccessToken);
						setAccessToken(newAccessToken);
					}

					if (newRefreshToken) {
						localStorage.setItem("refreshToken", newRefreshToken);
						setRefreshToken(newRefreshToken);
					}

					return newAccessToken || null;
				}

				return null;
			} catch (error) {
				console.error("Refresh token error:", error);
				logout();
				return null;
			}
		},
		[refreshTokenMutation, logout]
	);

	// Public refresh function
	const refreshAccessToken = useCallback(async (): Promise<string | null> => {
		if (!refreshToken) return null;

		return await refreshAccessTokenInternal(refreshToken);
	}, [refreshToken, refreshAccessTokenInternal]);

	const login = (newAccessToken: string, newRefreshToken: string) => {
		setAccessToken(newAccessToken);
		setRefreshToken(newRefreshToken);
		localStorage.setItem("accessToken", newAccessToken);
		localStorage.setItem("refreshToken", newRefreshToken);
	};

	// Load tokens from localStorage on app start
	useEffect(() => {
		const initializeAuth = async () => {
			const savedAccessToken = localStorage.getItem("accessToken");
			const savedRefreshToken = localStorage.getItem("refreshToken");

			if (savedAccessToken && savedRefreshToken) {
				if (isTokenExpired(savedAccessToken)) {
					setRefreshToken(savedRefreshToken);
					const newAccessToken = await refreshAccessTokenInternal(
						savedRefreshToken
					);
					if (!newAccessToken) {
						clearTokens();
					}
				} else {
					setAccessToken(savedAccessToken);
					setRefreshToken(savedRefreshToken);
				}
			}
			setIsLoading(false);
		};

		initializeAuth();
	}, [refreshAccessTokenInternal]);

	// Auto-refresh token before it expires
	useEffect(() => {
		if (!accessToken) return;

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let intervalId: ReturnType<typeof setInterval> | null = null;

		const sixMinutes = 6 * 60 * 1000;

		const scheduleRefreshChecks = () => {
			try {
				const payload = JSON.parse(atob(accessToken.split(".")[1]));
				const expirationTime = payload.exp * 1000;
				const currentTime = Date.now();
				const timeUntilExpiry = expirationTime - currentTime;

				// If already expired or within the 6 minute window, refresh now
				if (timeUntilExpiry <= 0 || timeUntilExpiry <= sixMinutes) {
					refreshAccessToken();
					return;
				}

				// Schedule a timeout to refresh 6 minutes before expiry
				const refreshTime = timeUntilExpiry - sixMinutes;
				// Protect against extremely small values
				const effectiveRefreshTime = Math.max(refreshTime, 1000);

				timeoutId = setTimeout(() => {
					refreshAccessToken();
				}, effectiveRefreshTime);

				// Backup interval: check every minute (handles throttling/idle tabs)
				intervalId = setInterval(() => {
					try {
						const now = Date.now();
						if (expirationTime - now <= sixMinutes) {
							refreshAccessToken();
						}
					} catch {
						// ignore
					}
				}, 60 * 1000);
			} catch (error) {
				console.error("Error setting up token refresh:", error);
			}
		};

		const handleVisibilityOrFocus = () => {
			try {
				if (!accessToken) return;
				const payload = JSON.parse(atob(accessToken.split(".")[1]));
				const expirationTime = payload.exp * 1000;
				const now = Date.now();
				if (expirationTime - now <= sixMinutes) {
					refreshAccessToken();
				}
			} catch {
				// If parsing fails, try to refresh as a fallback
				refreshAccessToken();
			}
		};

		scheduleRefreshChecks();
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") handleVisibilityOrFocus();
		});
		window.addEventListener("focus", handleVisibilityOrFocus);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
			document.removeEventListener("visibilitychange", () => {
				if (document.visibilityState === "visible") handleVisibilityOrFocus();
			});
			window.removeEventListener("focus", handleVisibilityOrFocus);
		};
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
