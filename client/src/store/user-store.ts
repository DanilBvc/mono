import { create } from 'zustand';

interface userState {
  _id: string;
  userName: string;
  accessToken: string;
  unfinishedGame: string;
}

interface userStore {
  userData: userState | null;
  setUserData: (user: userState) => void;
}

const useUserDataStore = create<userStore>((set) => ({
  userData: null,
  setUserData: (userData: userState) => {
    set((state) => ({
      userData,
    }));
  },
}));

export default useUserDataStore;
