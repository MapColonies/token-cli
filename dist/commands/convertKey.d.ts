import yargs from 'yargs';
export interface VerifyArguments {
    [x: string]: unknown;
    f: string;
    progress: boolean;
}
export declare const command = "convert";
export declare const describe = "convert a key to pem";
export declare const builder: yargs.CommandBuilder<{}, VerifyArguments>;
export declare const handler: (argv: VerifyArguments) => Promise<void>;
