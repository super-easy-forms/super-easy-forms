export declare const stdout: (opts?: {
    print?: boolean | undefined;
    stripColor?: boolean | undefined;
}) => {
    run(ctx: {
        readonly stdout: string;
    }): void;
    finally(): void;
};
export declare const stderr: (opts?: {
    print?: boolean | undefined;
    stripColor?: boolean | undefined;
}) => {
    run(ctx: {
        readonly stderr: string;
    }): void;
    finally(): void;
};
export declare const stdin: (input: string, delay?: number) => {
    run: () => void;
    finally(): void;
};
