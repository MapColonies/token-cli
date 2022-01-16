import { JWTPayload } from 'jose/jwt/sign';
import { JWK, KeyLike } from 'jose/webcrypto/types';
export interface KeyPair {
    publicKey: JWK;
    privateKey: JWK;
}
export declare const generateKeyPair: (kid?: string | undefined) => Promise<KeyPair>;
export declare const generateToken: (privateKey: KeyLike, client: string, allowedOrigin?: string[] | undefined, kid?: string | undefined) => Promise<string>;
export declare const verifyToken: (publicKey: KeyLike, token: string, kid?: string | undefined) => Promise<JWTPayload>;
export declare const readAndParseJWK: (filePath: string) => Promise<{
    key: KeyLike;
    kid: string | undefined;
}>;
