export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    fName: string;
    lName: string;
    email: string;
    password: string;
    profile: File|null;
    information: string;
}

export interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;
}