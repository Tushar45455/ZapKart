import UserModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import sendEmail from '../utils/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';

export async function registerUserController(request,responce){
    try {
        const { name, email, password } = request.body

        if(!name || !email || !password){
            return responce.status(400).json({
                message : "provide email, name, password",
                success : false
            })
        }
     
        const user = await UserModel.findOne({ email})

        if(user){
            return responce.json({
                message : "User already exists",
                error : true,
                success : false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()
        
        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from binkit",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })
        
        return responce.json({
            message : "User register successfully",
            error : false,
            success : true,
            data : save,
        })


    } catch (error) {
        return responce.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}