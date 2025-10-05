import { createContext } from "react";

interface AuthContextType {
	accessToken: string | null;
	refreshToken: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
	refreshAccessToken: () => Promise<string | null>;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
export type { AuthContextType };
