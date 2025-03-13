export type Recipe = {
    id: number,
    title: string,
    degree: number,
    createdAt: Date
}
export type RecipeWithOutId = {
    title: string,
    degree: number,
    createdAt: Date
}