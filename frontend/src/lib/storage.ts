const storagePrefix = 'cm';

const storage = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(`${storagePrefix}token`);
    }
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${storagePrefix}token`, token);
    }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`${storagePrefix}token`);
    }
  }
};
export default storage;
