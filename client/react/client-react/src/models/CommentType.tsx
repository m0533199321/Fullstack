import { UserDto } from "./UserType"

export type CommentType = {
    id: number,
    recipeId: number,
    userId: number,
    user: UserDto,
    content: string,
    createdAt: Date
}