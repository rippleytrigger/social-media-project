export class User{
    public _id: string
    public gettoken = Boolean
    public name: string
    public surname: string
    public nick: string
    public email: string
    public password: string
    public role: string
    public image: string

    constructor(_id, gettoken, name, surname, nick, email, password, role, image )
    {
        this._id = _id
        this.gettoken = gettoken
        this.name = name
        this.surname = surname
        this.nick = nick
        this.email = email
        this.password = password
        this.role = role
        this.image = image
    }
}

