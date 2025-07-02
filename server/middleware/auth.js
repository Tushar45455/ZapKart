import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (request, response, next) => {
    try {
        const token =
            request.cookies.accessToken ||
            (request.headers.authorization && request.headers.authorization.split(" ")[1]);
        if (!token) {
            return response.status(401).json({
                message: "Provide token",
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if (!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        request.userId = decode._id; // use _id if that's what you sign in your token

        next();
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export default auth;