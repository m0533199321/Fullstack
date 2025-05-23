export class Recipe {
    constructor(
        public id: number,
        public title: string,
        public isPublic: boolean,
        public degree: number,
        public createdAt: Date,
        public path: string,
        public profile: string,
        public commentsList: []) { };
}
