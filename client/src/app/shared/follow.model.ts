export class Follow{
    private _id: string
    private user: string
    private followed: string
    
    constructor(_id, user, followed)
    {
        this._id = _id
        this.user = user
        this.followed = followed
    }
}

