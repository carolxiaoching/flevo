// token 相關

export const setToken = (token: string): void => {
  const expries = new Date(Date.now() + 1000 * 60 * 60).toUTCString();
  document.cookie = `flevoFront=${token}; expires=${expries}; path=/`;
};

export const getToken = (): string => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)flevoFront\s*=\s*([^;]*).*$)|^.*$/, '$1');
  return token;
};

export const clearToken = (): void => {
  document.cookie = 'flevoFront=;expires=;path=/';
};
