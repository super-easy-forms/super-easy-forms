import { NockCallback, NockOptions } from './types';
export declare function nock(host: string, options: NockCallback | NockOptions, cb?: NockCallback): {
    run(): void;
} | {
    run(ctx: {
        nock: number;
    }): Promise<void>;
    finally(ctx: {
        error?: Error | undefined;
        nock: number;
    }): void;
};
