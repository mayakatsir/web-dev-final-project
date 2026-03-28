import userRepository from '../repositories/userRepository';
import { generateToken } from '../services/auth';
import { googleLogin } from '../services/google';

export const signInWithGoogle = async (credential: string) => {
    const payload = await googleLogin(credential);
    const userGmail = payload?.email;

    if (!userGmail || !payload?.given_name || !payload?.family_name) {
        throw new Error('Received an invalid response from Google');
    }

    let user = await userRepository.getUserByEmail(userGmail);
    if (!user) {
        const username = payload.given_name + payload.family_name;
        user = await userRepository.createUser(username, userGmail, 'google-sign-in');
    }

    const tokens = generateToken(user._id.toString());
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    return {
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        user: {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
        },
    };
};
