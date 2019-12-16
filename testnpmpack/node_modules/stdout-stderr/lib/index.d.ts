export interface MockStd {
    /**
     * strip color with ansi-strip
     *
     * @default true
     */
    stripColor: boolean;
    /**
     * also print to console
     *
     * @default false
     */
    print: boolean;
    /** get what has been written to stdout/stderr */
    readonly output: string;
    /** start mocking */
    start(): void;
    /** stop mocking */
    stop(): void;
}
export declare const stdout: MockStd;
export declare const stderr: MockStd;
