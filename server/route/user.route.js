import { Router } from 'express';
import { 
    loginController, 
    logoutController, 
    registerUserController, 
    verifyEmailController, 
    uploadAvatar, 
    updateUserDetails, 
    forgotPasswordController, 
    verifyForgotPasswordOtp, 
    resetPassword, 
    refreshToken 
} from '../controllers/user.controller.js';
import multer from 'multer';
import auth from '../middleware/auth.js';

const storage = multer.memoryStorage(); // or configure as needed
const upload = multer({ storage });

const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/verify-email', verifyEmailController);
userRouter.post('/login', loginController);
userRouter.get('/logout', auth, logoutController); 
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);
userRouter.put('/update-user', auth, updateUserDetails);
userRouter.put('/forgot-password', forgotPasswordController);
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.put('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshToken);

export default userRouter;