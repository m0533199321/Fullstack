export interface RecipeInterface {
    id: number,
    title: string,
    isPublic: boolean,
    degree: number,
    createdAt: Date,
    path: string,
    picture: string,
    // category: number
}

export interface RecipePostModel {
    title: string,
    degree: number,
    isPublic: boolean,
    path: string,
    picture: string,
    // category: number
}

export type Recipe = {
    id: number,
    title: string,
    isPublic: boolean,
    degree: number,
    createdAt: Date,
    path: string,
    picture: string,
    // category: number
}

export type RecipeWithOutId = {
    title: string,
    degree: number,
    createdAt: Date,
    path: string,
    picture: string,
    // category: number
}

