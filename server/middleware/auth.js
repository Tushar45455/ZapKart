import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (request, responce, next) => {
    try {
        const token = request.cookies.accessToken || request?.header?.authorization?.split("")[1]
        if (!token) {
            return responce.status(401).json({
                message: "Provide token",
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return responce.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        request.userId = decode.id;

        next();
    } catch (error) {
        return responce.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default auth;