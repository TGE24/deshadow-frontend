import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreType = {
	accessToken?: string;
	challengeToken?: string;
	refreshToken?: string;
	requires2FA?: boolean;
};

export type AuthStore = {
	authPayload: Partial<AuthStoreType> | null;
	setAuthPayload: (authPayload: AuthStoreType | null) => void;
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => {
			const storedState =
				typeof window !== "undefined"
					? window.localStorage.getItem("authStore")
					: "";
			const initialState = storedState ? JSON.parse(storedState) : {};
			return {
				...initialState.state,
				setAuthPayload: (authPayload) => set(() => ({ authPayload })),
			};
		},
		{
			name: "authStore",
			skipHydration: true,
		}
	)
);
