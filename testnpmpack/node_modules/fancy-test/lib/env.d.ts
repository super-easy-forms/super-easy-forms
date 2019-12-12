import { EnvOptions } from './types';
declare const _default: (env: {
    [k: string]: string | null | undefined;
}, opts?: EnvOptions) => {
    run(): void;
    finally(): void;
};
export default _default;
