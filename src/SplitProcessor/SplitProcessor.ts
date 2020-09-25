import {
  BaseProcessor,
  IRowProcessorInput,
  IRowProcessorOutput,
} from "@data-channels/dcSDK";

export interface ISplitConfig {
  splitRowCount?: number;
  isIncludeHeaderCount?: boolean;
  splitOutFileCount: number;
}

/**
 * Split processor used to split single input file(.csv | .txt)
 * into multiple output files based on the split processor configuration.
 */
export default class SplitProcessor extends BaseProcessor {
  private fileCount!: number;
  private rowIndex!: number;
  private splitCount!: number;

  /**
   * Split function used to split the input file into single or multiple output files
   * based on the split count.
   * @param input IRowProcessorInput
   */
  public async split(input: IRowProcessorInput): Promise<IRowProcessorOutput> {
    const {
      isIncludeHeaderCount,
      splitRowCount,
      splitOutFileCount,
    } = input.parameters as ISplitConfig;
    // Index 1 refers to the first row(header details) of the input file
    if (input.index === 1) {
      this.fileCount = 1;
      // If isIncludeHeaderCount is configured as true, then the header row will included in the splitRowCount
      if (isIncludeHeaderCount) {
        this.rowIndex = 1;
      } else {
        this.rowIndex = 0;
      }
      this.splitCount = splitRowCount ?? 0;
      const headerOutput: { [key: string]: string[] } = {};
      // Dynamically set the header row to all the output files.
      for (let i = 1; i <= splitOutFileCount; i++) {
        headerOutput[`${input.name}_${i}`] = input.raw;
      }

      return {
        outputs: headerOutput,
      };
    }
    const splitCondition =
      input.index > 2 && this.rowIndex % this.splitCount === 0;
    // Based on the splitCondition, it increments the file count
    // writes the corresponding row to the specified file.
    if (splitCondition) {
      this.fileCount += 1;
      if (isIncludeHeaderCount) {
        this.rowIndex += 1;
      }
    }
    this.rowIndex += 1;

    return {
      outputs: {
        [`${input.name}_${this.fileCount}`]: input.raw,
      },
    };
  }
}
