import { expressjwt, type GetVerificationKey } from 'express-jwt';
import JwksClient from 'jwks-rsa';
import config from 'config';
import { type Request } from 'express';
import type { AuthCookie } from '../types/index.js';

export default expressjwt({
    secret: JwksClient.expressJwtSecret({
        jwksUri: config.get('auth.jwksUri'),
        cache: true,
        rateLimit: true,
    }) as unknown as GetVerificationKey,
    algorithms: ['RS256'],

    getToken(req: Request) {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
