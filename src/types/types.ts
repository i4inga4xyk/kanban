export interface IUser {
    id: string
    username: string
    email: string
}

export enum UserSearchFields {
    id = 'id',
    email = 'email',
    username = 'username'
}