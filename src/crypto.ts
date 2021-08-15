import { promisify } from 'util';
import { generateKeyPair as generateKeyPairCB, KeyObject } from 'crypto';
import { JWTPayload, SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import { JWK, KeyLike } from 'jose/webcrypto/types';
import { ISSUER } from './constants';

const generateKeyPairAsync = promisify(generateKeyPairCB);

const exportJwk = (key: KeyObject): JWK => {
  return key.export({ format: 'jwk' });
};

export interface KeyPair {
  publicKey: JWK;
  privateKey: JWK;
}

export const generateKeyPair = async (): Promise<KeyPair> => {
  const { privateKey, publicKey } = await generateKeyPairAsync('rsa', { modulusLength: 2048, publicExponent: 0x10001 });
  return { privateKey: exportJwk(privateKey), publicKey: exportJwk(publicKey) };
};

export const generateToken = async (privateKey: KeyLike, client: string, allowedOrigin?: string[], kid?: string): Promise<string> => {
  return new SignJWT({ ao: allowedOrigin })
    .setIssuedAt()
    .setProtectedHeader({ alg: 'RS256', kid })
    .setSubject(client)
    .setIssuer(ISSUER)
    .sign(privateKey);
};

export const verifyToken = async (publicKey: KeyLike, token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, publicKey);
  return payload;
};
