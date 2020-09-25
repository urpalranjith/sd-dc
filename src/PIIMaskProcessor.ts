import {
  BaseProcessor,
  IRowProcessorInput,
  IRowProcessorOutput,
  IStepAfterOutput,
} from "@data-channels/dcSDK";
import AWS, { AWSError, DynamoDB } from "aws-sdk";
import {
  BatchWriteItemInput,
  ItemList,
  WriteRequest,
} from "aws-sdk/clients/dynamodb";

import {
  IColumnConfig,
  IHeaderProperty,
  IObjWithKeyStrValAny,
  IObjWithKeyStrValStr,
} from "./Processor.interface";

/**
 * PIIMask processor masks the PII data in each row based on the configuration
 * in the database for each user provided files.
 */
export default class PIIMaskProcessor extends BaseProcessor {
  private filePiiHeaders: IHeaderProperty[] = [];
  private dbPiiConfig: IColumnConfig[] = [];
  private headers: IColumnConfig[] = [];
  private keyValueMapping: IObjWithKeyStrValStr = {};
  private inputFileNames: string[] = [
    "users",
    "relationships",
    "enrollment",
    "sections",
  ];
  private fileName: string | undefined = "";
  private awsDynamoDb = new DynamoDB({ apiVersion: "2012-08-10" });

  /**
   * We can perform our operations before processing a file work like
   * Intializing the database and so on.
   * We can able to fetch the Input parameters from the channel config
   * in this function as an input if required.
   * @param input IStepBeforeInput
   */
  public async before_piiMask() {
    try {
      const getPIIConfigData = await this.getPiiConfigTableData();
      const dynamoDbReferenceData = await this.getDynamoDbReferenceTable();
      console.log("Reference table data fetched successfully.");
      // Check whether the reference table values exists or not
      if (Object.keys(dynamoDbReferenceData).length > 0) {
        this.keyValueMapping = { ...dynamoDbReferenceData };
      }
    } catch (error) {
      throw new Error(
        `Error while fetching the PII config from Dynamo DB: ${error}`
      );
    }
  }

  /**
   * Fetch the PII config table data
   * pushed the data into the this.dbPiiConfig instance variable.
   */
  private async getPiiConfigTableData() {
    try {
      const paramsForPiiConfigDb = this.inputFileNames.map(
        (userFileName: string) => {
          return {
            fileName: {
              S: userFileName,
            },
          };
        }
      );
      const { Responses: piiConfigData = {} } = await this.awsDynamoDb
        .batchGetItem({
          RequestItems: {
            piifFileConfig: {
              Keys: paramsForPiiConfigDb,
            },
          },
        })
        .promise();

      // Checks whether the DB returns the PII config values
      // If yes, stores the data in the this.dbPiiConfig
      if (Object.keys(piiConfigData).length > 0) {
        const piiFileConfigData = piiConfigData["piifFileConfig"];
        if (Array.isArray(piiFileConfigData)) {
          piiFileConfigData.map((piiFileConfigDataValue = {}) => {
            const dynamoDbToJsObj: any = AWS.DynamoDB.Converter.unmarshall(
              piiFileConfigDataValue
            );
            // Stores config in the instance variable
            this.dbPiiConfig.push(dynamoDbToJsObj);
          });
        }
        console.log("PII config table data fetched successfully");
      } else {
        // Else Throws an error when the PII config data is empty.
        throw new Error("PII config data is empty.");
      }
    } catch (error) {
      throw new Error(`Error while fetching PII config table: ${error}`);
    }
  }

  /**
   * Fetch the masked value from the DynamoDB table
   */
  private async getDynamoDbReferenceTable(): Promise<IObjWithKeyStrValStr> {
    try {
      const referenceTableValues: IObjWithKeyStrValStr = {};
      const scannedReferenceTableData = await this.awsDynamoDb
        .scan({ TableName: "reference" })
        .promise();
      if (Array.isArray(scannedReferenceTableData.Items)) {
        const unMarshallData: IObjWithKeyStrValStr[] = this.unMarshallData(
          scannedReferenceTableData.Items
        );
        unMarshallData.forEach(({ key, valueMapping }) => {
          referenceTableValues[key] = valueMapping;
        });
      }

      return referenceTableValues;
    } catch (error) {
      throw new Error(`DynamoDb refernce Table error: ${error}`);
    }
  }

  /**
   * Convert a JavaScript value to its equivalent DynamoDB
   * AttributeValue type
   * @param inputList ItemList
   */
  private unMarshallData(inputList: ItemList): IObjWithKeyStrValAny[] {
    return inputList.map((val: {}) => AWS.DynamoDB.Converter.unmarshall(val));
  }

  /**
   * Method to mask PII data
   * Process each row from the input.csv file("granularity": "row")
   * @param input IRowProcessorInput
   * @returns {outputs} Masked PII data
   */
  public async piiMask(
    input: IRowProcessorInput
  ): Promise<IRowProcessorOutput> {
    let finalRecord: string[] = [];
    // index = 1 determines the row header & new file entry
    if (input.index === 1) {
      // Dynamically get the file_name based on the input variable
      // provided in the channel.json
      this.fileName = this.inputFileNames.find((fileName: string) =>
        input.name.toLowerCase().includes(fileName)
      );

      // Get headers_config based on the file_name from the PII config table data
      this.dbPiiConfig.forEach((dbConfigObject: IColumnConfig): void => {
        if (dbConfigObject["fileName"] === this.fileName) {
          this.headers.push(dbConfigObject);

          return;
        }
      });
      // Generate the header objects to genrate the row with PII masked value
      this.filePiiHeaders = this.findHeaderIndex(input, this.headers);
      finalRecord = input.json;
    } else {
      // Generate the masked row data based on the PII config
      finalRecord = this.generatePiiMaskRow(input);
    }

    return {
      outputs: {
        [`${input.name}Output`]: finalRecord,
      },
    };
  }

  /**
   * Generate column headers object based on the PII config
   * to manipulate the row with PII data to masked value.
   * @param input IRowProcessorInput
   * @param dbConfig IColumnConfig[]
   */
  private findHeaderIndex(
    input: IRowProcessorInput,
    dbConfig: IColumnConfig[]
  ): IHeaderProperty[] {
    const { json: fileHeaders = [] } = input;
    const fileNameConfig: IColumnConfig = dbConfig.filter(
      (config: IObjWithKeyStrValAny) => config["fileName"] === this.fileName
    )[0];

    return fileHeaders.map((columnName: string, index: number) => {
      // For files doesn't present in the config,it takes maskpattern as empty string
      const columnObj = fileNameConfig?.["config"] ?? {
        maskPattern: "",
      };
      columnName = columnName.toLowerCase();
      const properties = { ...columnObj[columnName] };

      return {
        columnName,
        index,
        ...properties,
      };
    });
  }

  /**
   * Masks PII value in the row based on the PII config
   * @param input IRowProcessorInput
   */
  private generatePiiMaskRow(input: IRowProcessorInput): string[] {
    const headerObject: IHeaderProperty[] = this.filePiiHeaders;
    const { json: rowData = [] } = input;
    headerObject.forEach((headerData: IHeaderProperty) => {
      const { index } = headerData;
      rowData[index] = this.piiMapReferValue(input, headerData);
    });

    return rowData;
  }

  /**
   * Maps the masked value to the column value
   * @param input IRowProcessorInput
   * @param headerData Object
   */
  private piiMapReferValue(
    input: IRowProcessorInput,
    headerData: IObjWithKeyStrValAny
  ): string {
    const { json: rowData } = input;
    const {
      columnName = "",
      maskPattern = "",
      isReferred = false,
      isIncremental = false,
      index,
      referenceTo,
    } = headerData;
    let { counter } = headerData;
    let maskedValue = `${maskPattern}`;
    const rowValue = rowData[index];

    if (
      Boolean(rowValue in this.keyValueMapping && (referenceTo || isReferred))
    ) {
      return this.keyValueMapping[rowValue];
    }

    // If mask pattern (or) row value  key doesn't exists,
    // Return the row value
    if (!maskPattern || !rowValue) {
      return rowValue;
    }

    // Checks whether the column isIncremental to update the counter &
    // updates the counter in the DB.
    if (isIncremental) {
      const configObject: {
        config: IObjWithKeyStrValAny;
      }[] = this.dbPiiConfig.filter(
        (dbConfigObject: {
          fileName: string;
          config: IObjWithKeyStrValAny;
        }) => {
          if (dbConfigObject["fileName"] === this.fileName) {
            return dbConfigObject;
          }
        }
      );
      const counterkey = Object.assign({}, ...configObject);
      if (Object.keys(counterkey).length > 0) {
        counter += 1;
        headerData["counter"] = counter;
        counterkey["config"][columnName]["counter"] = counter;
        maskedValue = `${maskPattern}_${counter}`;
      }
    }
    // If the row value need's to be store in the  key-value mapping;
    if (isReferred) {
      this.keyValueMapping[rowValue] = maskedValue;
    }

    return maskedValue;
  }

  /**
   * Upadate the PII config table once all the files are processed.
   */
  private async updatePiiConfigDynamoDb(): Promise<void> {
    const dynamoDbStructure = this.dbConfigDynamoDbStructure(this.dbPiiConfig);
    const dbParams: BatchWriteItemInput = {
      RequestItems: {
        piifFileConfig: dynamoDbStructure,
      },
    };
    try {
      await this.awsDynamoDb.batchWriteItem(dbParams).promise();
      console.log("Successfully updated Pii config table");
    } catch (error) {
      throw new Error(
        `Error while updating DynamoDB PII config table : ${error}`
      );
    }
  }

  /**
   * Converts JavaScript Object to DynamoDb structure
   * @param dbPiiConfig Object
   */
  private dbConfigDynamoDbStructure(
    dbPiiConfig: IObjWithKeyStrValAny = []
  ): WriteRequest[] {
    return dbPiiConfig.map((obj: IObjWithKeyStrValAny) => {
      return {
        PutRequest: {
          Item: AWS.DynamoDB.Converter.marshall(obj),
        },
      };
    });
  }

  /**
   * Generates the DynamoDb schema for the reference table
   * @param obj Object
   */
  private dynamoDbStructreForRefernceTable(
    referenceObject: IObjWithKeyStrValStr
  ): WriteRequest[] {
    return Object.keys(referenceObject).map((key) => {
      return {
        PutRequest: {
          Item: {
            key: {
              S: key,
            },
            valueMapping: {
              S: referenceObject[key],
            },
          },
        },
      };
    });
  }

  /**
   * Chunks array based on the chunk size
   * used to chunk the masked value of size 25 to BatachWriteItems
   * in dynamoDB
   * @param arr WriteRequest[]
   * @param len Number
   */
  private chunk(inputArray: WriteRequest[], chunkSize: number) {
    const arrayChunks = [];
    let index = 0;
    const arrayLength = inputArray.length;
    while (index < arrayLength) {
      arrayChunks.push(inputArray.slice(index, (index += chunkSize)));
    }

    return arrayChunks;
  }

  /**
   * Update the reference table with latest key value mapping of PII data
   * in the Dynamo DB reference table.
   */
  private async updateReferenceValueDynamoDb() {
    const chunkedArray = this.chunk(
      this.dynamoDbStructreForRefernceTable(this.keyValueMapping),
      25
    );
    for (const arrayChunk of chunkedArray) {
      const dbParams: BatchWriteItemInput = {
        RequestItems: {
          reference: arrayChunk,
        },
      };
      try {
        if (arrayChunk.length) {
          await this.awsDynamoDb.batchWriteItem(dbParams).promise();
        }
      } catch (error) {
        throw new Error(
          `Error while updating DynamoDb reference Table: ${error}`
        );
      }
    }
  }

  /**
   * We can perform tasks after processing a file work here.
   * @param input IStepAfterInput
   */
  public async after_piiMask(): Promise<IStepAfterOutput> {
    // Update reference and Pii config table with updated value
    try {
      await this.updateReferenceValueDynamoDb().then(() =>
        console.log("Reference Table updated successfully")
      );
      await this.updatePiiConfigDynamoDb();
    } catch (error) {
      throw new Error(`Error while updating the Dynamo DB tables: ${error}`);
    }

    return {
      results: {
        // results can be any object you want, e.g. count of records exported, etc.
        myResult: "can be anything",
      },
    };
  }
}
