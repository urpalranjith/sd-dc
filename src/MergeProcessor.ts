import {
    BaseProcessor,
    IRowProcessorInput,
    IRowProcessorOutput,
} from "@data-channels/dcSDK";

// Modes in which the merge processor can operate
enum MergeMode {
    Concatenate = 'concatenate',
    Update = 'update'
}

// Configuration for the merge processor mode parameter
export interface IMergeConfig {
    mode?: string;
}

/**
 * Merge processor obtains multiple input files, compares headers of the files, concatenates the data
 * writes in to a single output file based on the mode
 */
export default class MergeProcessor extends BaseProcessor {
    private headers: string[] = [];

    /**
     * Method to identify the mode of the merge processor
     * @param input
     * @returns Promise<IRowProcessorOutput>
     */
    public async merge(input: IRowProcessorInput): Promise<IRowProcessorOutput> {
        const config = input.parameters as IMergeConfig;
        if (config.mode === MergeMode.Concatenate) {
            return this.concatenate(input);
        }

        return {
            outputs: {}
        }
    }
    /**
     * Method to merge the files after comparing the headers of the files
     * Process each row from the input.csv files("granularity": "row")
     * @param input
     * @returns Promise<IRowProcessorOutput>
     */
    public async concatenate(input: IRowProcessorInput): Promise<IRowProcessorOutput> {
        const { index, raw, name: fileName } = input;
        // store header record from the first file to use while comparing the next file headers
        if (index === 1) {
            if (this.headers.length === 0) {
                this.headers = raw;

                return {
                    outputs: {
                        mergeOutputFile: raw
                    }
                };
            } else {
                // checks if the headers across the files are same
                const isheaderSame = this.checkHeaderMatch(this.headers, raw);
                if (!isheaderSame) {
                    throw new Error(
                        `The file headers do not match for the file provided in the ${fileName}`
                    );
                }

                return {
                    outputs: {}
                }
            }
        }

        return {
            outputs: {
                mergeOutputFile: input.raw
            }
        };
    }

    /**
     * This functions evaluates the headers of the current file with the
     * first file header and return boolean false if they do not match
     * @param headerToMatch
     * @param currentFileHeader
     */
    public checkHeaderMatch(headerToMatch: string[], currentFileHeader: string[]) {
        return headerToMatch.length === currentFileHeader.length &&
            headerToMatch.every((val, index) => val.toLowerCase() === currentFileHeader[index].toLowerCase());
    }
}