import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { generateKeyPair as generateKeyPairCB, KeyObject } from 'crypto';
import { JWTPayload, SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import { JWK, KeyLike } from 'jose/webcrypto/types';
import Ajv from 'ajv/dist/jtd';
import { parseJwk } from 'jose/jwk/parse';
import { ISSUER } from './constants';
import { jwkSchema } from './schemas/jwk';

const SUPPORTED_ALGORITHEMS = ['RSA256'];

const generateKeyPairAsync = promisify(generateKeyPairCB);

const ajv = new Ajv();
const jwkStringParser = ajv.compileParser(jwkSchema);

const exportJwk = (key: KeyObject): JWK => {
  return key.export({ format: 'jwk' });
};

export interface KeyPair {
  publicKey: JWK;
  privateKey: JWK;
}

export const generateKeyPair = async (kid?: string): Promise<KeyPair> => {
  const { privateKey, publicKey } = await generateKeyPairAsync('rsa', { modulusLength: 2048, publicExponent: 0x10001 });
  const jwkPair = { privateKey: exportJwk(privateKey), publicKey: exportJwk(publicKey) };
  jwkPair.privateKey.alg = jwkPair.publicKey.alg = 'RSA256';
  jwkPair.privateKey.kid = jwkPair.publicKey.kid = kid;
  return jwkPair;
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

export const readAndParseJWK = async (filePath: string): Promise<KeyLike> => {
  const fileContent = await readFile(filePath, 'utf-8');

  const jwk = jwkStringParser(fileContent);

  if (!jwk) {
    throw new Error("Couldn't parse the content of the file into a valid jwk object");
  }

  if (jwk.alg === undefined || !SUPPORTED_ALGORITHEMS.includes(jwk.alg)) {
    throw new Error('key algorithm is not supported');
  }

  return parseJwk(jwk);
};
