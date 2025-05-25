export class Recipe {
    constructor(
        public id: number,
        public title: string,
        public isPublic: boolean,
        public degree: number,
        public createdAt: Date,
        public path: string,
        public picture: string,
        public commentsList: []) { };
}


export class RecipePostModel {
    constructor(
        public title: string,
        public degree: number,
        public path: string,
        public picture: string) { };
}

export interface RecipeWithOwner extends Recipe {
    ownerName?: string
    ownerId?: number
}
