import { NextFunction, Response, Request } from "express";
import {CookieType} from "../types/cookieType"


export const checkAuth = (req: Request & CookieType ,res: Response,next: NextFunction) =>{

    if(req.session.userId){
        return next();
    }

    return res.status(403).json({
        status:'error',
        data:null,
        message:"Not authorized!"
    })

}