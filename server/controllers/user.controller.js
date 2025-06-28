import UserModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import sendEmail from '../utils/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';

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
            subject: "Verify email from ZapKart",
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

export async function verifyEmailController(request, responce) {
    try {
        const { code } = request.body;
        const user = await UserModel.findOne({ _id: code });

        if(!user){
            return responce.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({_id : code},{
           verify_email : true  
        })

        return responce.json({
            message: "Verify email done",
            success: true,
            error: false,
        })
    }
    catch (error) {
        return responce.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//login controller
export async function loginUserController(request, responce) {
    try {
         const { email , password } = request.body

         if(!email || !password){
            return responce.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            })
         }


         const user =await UserModel.findOne({ email })

         if(!user){
            return responce.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }
        if(user.status !== "Active"){
            return responce.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
        })
     }
     
     const checkPassword = await bcrypt.compare(password, user.password)

     if(!checkPassword){
        return responce.status(400).json({
            message: "Check your password",
            error: true,    
            success: false
        })
     }

     const accesstoken = await generatedAccessToken(user._id)
     const refreshToken = await generatedRefreshToken(user._id)

     const cookiesOption = {
        httpOnly: true,
        secure : true,
        sameSite: "None",

     }

     responce.cookie("accessToken", accesstoken, cookiesOption)
     responce.cookie("refreshToken", refreshToken, cookiesOption)

     return responce.json({
        message: "Login successful",
        error: false,
        success: true,
        data: {
            accesstoken,
            refreshToken
        }
     })


     return responce.json({
        message: "Login successful",
        error: false,
        success: true,
        data: user
    });
    } catch (error) {
        return responce.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//logout controller

export async function logoutController(request, responce) {
    try {
        const userid = request.userId  //middleware auth.js


        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
         responce.clearCookie("accessToken",cookiesOption)
         responce.clearCookie("refreshToken",cookiesOption)

         const reomveRefreshToken = await UserModel.findByIdAndUpdate(userid,{
                refreshToken: ""
         })


         return responce.json({
             message: "Logout successfully",
             error: false,
             success: true
         });
    } catch (error) {
        return responce.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}