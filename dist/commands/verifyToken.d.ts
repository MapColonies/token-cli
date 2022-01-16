import yargs from 'yargs';
export interface VerifyArguments {
    [x: string]: unknown;
    f: string;
    token: string;
    progress: boolean;
}
export declare const command = "verify";
export declare const describe = "verify that a token is signed by the provided key, and return its payload";
export declare const builder: yargs.CommandBuilder<{}, VerifyArguments>;
export declare const handler: (argv: VerifyArguments) => Promise<void>;
