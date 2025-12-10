import { create } from "zustand";
import { produce } from "immer";

// NextAuth User type
export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserSessionStore = {
  user: User | null;
};

type UserSessionActions = {
  setUser: (user: User | null) => void;
};

export const useUserSessionStore = create<UserSessionStore & UserSessionActions>()((set) => {
  return {
    user: null,
    setUser: (user: User | null) =>
      set(
        produce((state: UserSessionStore) => {
          state.user = user;
        }),
      ),
  };
});
