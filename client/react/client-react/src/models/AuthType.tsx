import { User } from "./UserType";

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    fName: string;
    lName: string;
    email: string;
    password: string;
    profile: string | null;
    information: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}