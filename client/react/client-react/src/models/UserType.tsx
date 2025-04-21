export type User = {
    id: number,
    fName: string;
    lName: string;
    email: string;
    password: string;
    profile: string;
    // information: string;
    createdAt: Date;
    //recipesList: Recipe[]
    //rolesList: Role[]
}

export type UserDto = {
    id: number,
    fName: string;
    lName: string;
    email: string;
    password: string;
    profile: string;
    createdAt: Date;
}