import * as Config from '@oclif/config';
import { loadConfig } from './load-config';
export declare function command(args: string[] | string, opts?: loadConfig.Options): {
    run(ctx: {
        config: Config.IConfig;
        expectation: string;
    }): Promise<void>;
};
