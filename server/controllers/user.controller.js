import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

const uploadImageCloudinary = async (image) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'ZapKart' }, (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
        }).end(buffer);
    });
    return uploadImage;
};

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, password",
                success: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return response.json({
                message: "User already exists",
                error: true,
                success: false
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const payload = { name, email, password: hashedPassword };
        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
        await sendEmail({
            sendTo: email,
            subject: "Verify email from ZapKart",
            html: verifyEmailTemplate({ name, url: VerifyEmailUrl })
        });

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
        const user = await UserModel.findOne({ _id: code });
        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            });
        }
        await UserModel.updateOne({ _id: code }, { verify_email: true });
        return response.json({
            message: "Verify email done",
            success: true,
            error: false,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            });
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }
        const accesstoken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        response.cookie("accessToken", accesstoken, cookiesOption);
        response.cookie("refreshToken", refreshToken, cookiesOption);

        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshToken
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function logoutController(request, response) {
    try {
        const userid = request.userId;
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        await UserModel.findByIdAndUpdate(userid, { refresh_token: "" });

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;
        const image = request.file;
        const upload = await uploadImageCloudinary(image);

        await UserModel.findByIdAndUpdate(userId, { avatar: upload.url });

        return response.json({
            message: "Avatar uploaded successfully",
            data: {
                _id: userId,
                avatar: upload.url,
            },
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;
        let hashPassword = "";

        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobile && { mobile }),
            ...(password && { password: hashPassword })
        });

        return response.json({
            message: "User details updated successfully",
            success: true,
            error: false,
            data: updateUser
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email not found",
                error: true,
                success: false
            });
        }
        const otp = generatedOtp();
        const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expire: new Date(expireTime).toISOString()
        });

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password from ZapKart",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp,
            })
        });

        return response.json({
            message: "Check your email",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;
        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide email and otp",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email not found",
                error: true,
                success: false
            });
        }
        const currentTime = new Date().toISOString();
        if (user.forgot_password_expire < currentTime) {
            return response.status(400).json({
                message: "Otp expired",
                error: true,
                success: false
            });
        }
        if (String(user.forgot_password_otp) !== String(otp)) {
            return response.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            });
        }
        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: null,
            forgot_password_expire: null
        });
        return response.json({
            message: "Otp verified successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide email, new password and confirm password",
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email not found",
                error: true,
                success: false
            });
        }
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and confirm password do not match",
                error: true,
                success: false
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        });

        return response.json({
            message: "Password reset successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken =
            request.cookies?.refreshToken ||
            (request.headers.authorization && request.headers.authorization.split(" ")[1]); // Bearer <token>

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false,
            });
        }

        let verifyToken;
        try {
            verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
        } catch (err) {
            return response.status(401).json({
                message: "Token is expired or invalid",
                error: true,
                success: false,
            });
        }

        const userId = verifyToken._id;
        const newAccessToken = await generatedAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        response.cookie("accessToken", newAccessToken, cookiesOption);

        return response.json({
            message: "New access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}