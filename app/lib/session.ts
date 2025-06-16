export const saveSession = (userData: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const getSession = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const clearSession = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};