export const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Zא-ת])(?=.*\d)[a-zA-Zא-ת\d]{6,}$/;
    return passwordRegex.test(password);
};
