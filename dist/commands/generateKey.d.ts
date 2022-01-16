import yargs from 'yargs';
export interface GenerateKeyArguments {
    [x: string]: unknown;
    kid: string;
    s: boolean | undefined;
    p: string | undefined;
    progress: boolean;
}
export declare const command = "generate-key";
export declare const describe = "generate a new key pair for signing tokens";
export declare const builder: yargs.CommandBuilder<{}, GenerateKeyArguments>;
export declare const handler: (argv: GenerateKeyArguments) => Promise<void>;
