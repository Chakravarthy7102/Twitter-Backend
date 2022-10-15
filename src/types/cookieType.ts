import { Session } from 'express-session'

export type CookieType = {
    session : Session & {userId: number}
}