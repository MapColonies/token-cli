export declare const spinify: <R, A extends unknown[], F extends (...args: A) => Promise<R>>(func: F, options: {
    message: string;
    isEnabled: boolean;
    timeout?: number;
}, ...args: A) => Promise<ReturnType<F>>;
