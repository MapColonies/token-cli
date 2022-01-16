"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAndParseJWK = exports.verifyToken = exports.generateToken = exports.generateKeyPair = void 0;
const util_1 = require("util");
const promises_1 = require("fs/promises");
const crypto_1 = require("crypto");
const sign_1 = require("jose/jwt/sign");
const verify_1 = require("jose/jwt/verify");
const jtd_1 = __importDefault(require("ajv/dist/jtd"));
const parse_1 = require("jose/jwk/parse");
const constants_1 = require("./constants");
const jwk_1 = require("./schemas/jwk");
const SUPPORTED_ALGORITHEMS = ['RSA256'];
const generateKeyPairAsync = util_1.promisify(crypto_1.generateKeyPair);
const ajv = new jtd_1.default();
const jwkStringParser = ajv.compileParser(jwk_1.jwkSchema);
const exportJwk = (key) => {
    return key.export({ format: 'jwk' });
};
const generateKeyPair = async (kid) => {
    const { privateKey, publicKey } = await generateKeyPairAsync('rsa', { modulusLength: 2048, publicExponent: 0x10001 });
    const jwkPair = { privateKey: exportJwk(privateKey), publicKey: exportJwk(publicKey) };
    jwkPair.privateKey.alg = jwkPair.publicKey.alg = 'RSA256';
    jwkPair.privateKey.kid = jwkPair.publicKey.kid = kid;
    return jwkPair;
};
exports.generateKeyPair = generateKeyPair;
const generateToken = async (privateKey, client, allowedOrigin, kid) => {
    return new sign_1.SignJWT({ ao: allowedOrigin })
        .setIssuedAt()
        .setProtectedHeader({ alg: 'RS256', kid })
        .setSubject(client)
        .setIssuer(constants_1.ISSUER)
        .sign(privateKey);
};
exports.generateToken = generateToken;
const verifyToken = async (publicKey, token, kid) => {
    const { payload, protectedHeader } = await verify_1.jwtVerify(token, publicKey);
    if (protectedHeader.kid !== kid) {
        throw new Error("kid doesn't match");
    }
    return payload;
};
exports.verifyToken = verifyToken;
const readAndParseJWK = async (filePath) => {
    const fileContent = await promises_1.readFile(filePath, 'utf-8');
    const jwk = jwkStringParser(fileContent);
    if (!jwk) {
        throw new Error("Couldn't parse the content of the file into a valid jwk object");
    }
    if (jwk.alg === undefined || !SUPPORTED_ALGORITHEMS.includes(jwk.alg)) {
        throw new Error('key algorithm is not supported');
    }
    return { key: await parse_1.parseJwk(jwk), kid: jwk.kid };
};
exports.readAndParseJWK = readAndParseJWK;
//# sourceMappingURL=crypto.js.map