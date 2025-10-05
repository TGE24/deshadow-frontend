import { create } from "zustand";
import { User } from "../generated/graphql";
import { persist } from "zustand/middleware";

export type UserStore = {
	user: User | null;
	setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>()(
	persist(
		(set) => {
			const storedState =
				typeof window !== "undefined"
					? window.localStorage.getItem("userStore")
					: "";
			const initialState = storedState ? JSON.parse(storedState) : {};
			return {
				...initialState.state,
				setUser: (user) => set(() => ({ user })),
			};
		},
		{
			name: "userStore",
			skipHydration: true,
		}
	)
);
