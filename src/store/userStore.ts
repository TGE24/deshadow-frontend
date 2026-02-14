import { create } from "zustand";
import { User } from "../generated/graphql";
import { persist } from "zustand/middleware";

export type SelectedStore = {
	uuid: string;
	name: string;
};

export type UserStore = {
	user: Partial<User> | null;
	setUser: (user: Partial<User> | null) => void;
	selectedStore: SelectedStore | null;
	setSelectedStore: (store: SelectedStore | null) => void;
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
				setSelectedStore: (store) => set(() => ({ selectedStore: store })),
			};
		},
		{
			name: "userStore",
			skipHydration: true,
		},
	),
);
