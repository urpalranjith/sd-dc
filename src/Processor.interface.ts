/**
 * IColumnConfig used to define structure of the column config
 * in the DynamoDB PII config table
 */
export interface IColumnConfig {
  config: {
    [key: string]: {
      maskPattern?: string;
      referenceTo?: string;
      isReferred?: boolean;
      isIncremental?: boolean;
    };
  };
  fileName: string;
}

/**
 * IHeaderProperty for the column headers in each user's file,
 * used when we need to define structure of Header object based on the
 * PII mask config.
 */
export interface IHeaderProperty {
  columnName: string;
  index: number;
  maskPattern?: string;
  referenceTo?: string;
  isReferred?: boolean;
  isIncremental?: boolean;
}

/**
 * Generic interface for an Object contains key as 'String'
 * and value can be any data type.
 */
export interface IObjWithKeyStrValAny {
  [key: string]: any;
}

/**
 * Generic interface for an Object contains key as 'String'
 * and value as 'String'.
 */
export interface IObjWithKeyStrValStr {
  [key: string]: string;
}
