export interface IUser {
    name: string,
    uid : number,
    gid: number,
    comment: string,
    home: string,
    shell: string
}

export interface IGroup
{
    name: string,
    gid: number,
    members: any
}
