import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const generatedRefreshToken = async (userId) => {
    const token = await jwt.sign(
        { _id: userId }, // also corrected key name to _id to match your controller
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' }
    );

    await UserModel.updateOne(
        { _id: userId },
        { refresh_token: token }
    );

    return token;
};

export default generatedRefreshToken;
