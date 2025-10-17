import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreInterface {
    isAuthenticated: boolean;
    user: User | null | undefined;
    accessToken: string | null | undefined;
}

interface AuthStoreActionsInterface {
    setAuth: ({ }: {
        user: User | null | undefined;
        accessToken: string | undefined;
    }) => void;
    setUser: ({ }: { user: User | null | undefined }) => void;
    removeAuth: () => void;
    resetAuth: () => void;
}

const initialState: AuthStoreInterface = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
};

const useAuthStore = create(
    persist<AuthStoreInterface & AuthStoreActionsInterface>(
        (set, get) => ({
            ...initialState,
            setAuth: ({ accessToken, user }) =>
                set(() => ({
                    accessToken,
                    user,
                    isAuthenticated: true,
                })),
            setUser: ({ user }) =>
                set(() => ({
                    user,
                })),
            removeAuth: () =>
                set(() => ({
                    accessToken: null,
                    isAuthenticated: false,
                    user: null,
                })),
            resetAuth: () => set(() => ({ ...initialState })),
        }),
        { name: "auth-storage" }
    )
);

export default useAuthStore;
