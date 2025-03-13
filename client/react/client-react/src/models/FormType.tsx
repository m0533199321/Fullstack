export interface FormDataRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    allergies: string[];
    preferences: string;
    profilePicture: File | null;
    additionalNotes: string;
}

export interface FormDataLogin {
    email: string;
    password: string;
}
