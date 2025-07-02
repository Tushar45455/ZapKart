import jwt from 'jsonwebtoken';

const generatedAccessToken = async (userId) => {
    const token = await jwt.sign(
        { _id: userId }, // use _id for consistency
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '5h' }
    );
    return token;
};

export default generatedAccessToken;