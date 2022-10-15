import { Gender } from '../entities/User'

type Body = {
    username: string,
    gender: Gender,
    password: string
}

export const checkInputData = ({username,gender,password}: Body)=>{
    if(username.length < 3){
        return {
            status: false,
            message: "Please enter a valid username"
        }
    }

    if(password.length < 5){
        return {
            status: false,
            message:"Please enter a strong password with atleast of 5 charecters."
        }
    }

    if(!['male','female','other'].includes(gender)){
        return {
            status: false,
            message:"Please enter valid enum [MALE, FEMALE, OTHER]"
        }
    }

    return {
        status:true,
        message:"ok"
    }

}