"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwkSchema = void 0;
exports.jwkSchema = {
    optionalProperties: {
        'x5t#S256': { type: 'string' },
        alg: { type: 'string' },
        crv: { type: 'string' },
        d: { type: 'string' },
        dp: { type: 'string' },
        dq: { type: 'string' },
        e: { type: 'string' },
        ext: { type: 'boolean' },
        k: { type: 'string' },
        key_ops: { elements: { type: 'string' } },
        kid: { type: 'string' },
        kty: { type: 'string' },
        n: { type: 'string' },
        oth: { elements: { optionalProperties: { d: { type: 'string' }, r: { type: 'string' }, t: { type: 'string' } } } },
        p: { type: 'string' },
        q: { type: 'string' },
        qi: { type: 'string' },
        use: { type: 'string' },
        x: { type: 'string' },
        x5c: { elements: { type: 'string' } },
        x5t: { type: 'string' },
        x5u: { type: 'string' },
        y: { type: 'string' },
    },
};
//# sourceMappingURL=jwk.js.map