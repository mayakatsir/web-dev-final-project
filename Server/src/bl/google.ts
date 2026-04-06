import userRepository from '../repositories/userRepository';
import { generateToken } from '../services/auth';
import { googleLogin } from '../services/google';

export const signInWithGoogle = async (credential: string) => {
    const payload = await googleLogin(credential);
    const userGmail = payload?.email;

    if (!userGmail) {
        throw new Error('Received an invalid response from Google');
    }

    const name = payload.name ?? payload.given_name ?? '';
    const avatarUrl = payload.picture ?? '';

    let user = await userRepository.getUserByEmail(userGmail);
    if (!user) {
        const username = userGmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
        user = await userRepository.createUser(username, userGmail, 'google-sign-in', name, avatarUrl);
    } else if (!user.avatarUrl && avatarUrl) {
        await userRepository.updateUser(user._id.toString(), { avatarUrl, name: user.name || name });
        user = (await userRepository.getUserByEmail(userGmail))!;
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
            name: user.name ?? name,
            avatarUrl: user.avatarUrl ?? avatarUrl,
            bio: user.bio ?? '',
        },
    };
};
