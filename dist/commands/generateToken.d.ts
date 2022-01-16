import yargs from 'yargs';
export interface GenerateTokenArguments {
    [x: string]: unknown;
    f: string;
    c: string;
    client: string;
    o: string[] | undefined;
    progress: boolean;
}
export declare const command = "generate-token";
export declare const describe = "generate a jwt token";
export declare const builder: yargs.CommandBuilder<{}, GenerateTokenArguments>;
export declare const handler: (argv: GenerateTokenArguments) => Promise<void>;
