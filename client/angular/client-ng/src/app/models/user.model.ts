export class User {
    constructor(
        public id: number,
        public fName: string,
        public lName: string,
        public email: string,
        public password: string,
        public profile: string,
        public allergies: [],
        public preferences: string,
        public additionalNotes: string,
        public information: string) { }; 
}
