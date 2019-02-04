export class Message{
    private _id: string
    private viewed: boolean
    private text: string
    private emitter: string
    private created_at: string
    private receiver: string
    
    constructor(_id, text, viewed, emitter, receiver, created_at)
    {
        this._id = _id
        this.text = text
        this.viewed = viewed
        this.emitter = emitter
        this.receiver = receiver
        this.created_at = created_at
    }
}

