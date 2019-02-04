export class Publication{
    public _id: string
    public user: string
    public text: string
    public file: string
    public created_at: string
    
    constructor(_id, user, text, file, created_at)
    {
        this._id = _id
        this.user = user
        this.text = text
        this.file = file
        this.created_at = created_at
    }
}
