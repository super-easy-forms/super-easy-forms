declare const _default: (arg: string | RegExp | ((err: Error) => any), opts?: {
    raiseIfNotThrown?: boolean | undefined;
}) => {
    run(): void;
    catch(ctx: {
        error: Error;
    }): void;
};
export default _default;
