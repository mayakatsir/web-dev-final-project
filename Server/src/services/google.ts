import { OAuth2Client, VerifyIdTokenOptions } from 'google-auth-library';
import { getConfig } from './config';


const client = new OAuth2Client();

export const googleLogin = async (credential: VerifyIdTokenOptions['idToken']) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: getConfig().GOOGLE_CLIENT_ID,
        });

        return ticket.getPayload();
    } catch (error) {
        throw new Error('Invalid Google credential token');
    }
};