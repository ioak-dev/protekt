export interface Authorization {
    isAuth: boolean,
    token?: string,
    firstname?: string,
    lastname?: string,
    password?: string
}

export interface Profile {
    theme: string,
    textSize: string,
    themeColor: string
}

export interface Message {
    name: string,
    signal: boolean,
    data?: any
}