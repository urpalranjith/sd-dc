# PII Mask

- PII mask processor can take single or multiple (.csv|.txt) files as an inputs and
  generate the PII masked value for each column in the row, based on the PII masking
  config present in the Dynamo DB.

- The configuration file holds the column names with the a flag which states whether
  the column qualifies for masking or not and if yes then whats the pattern to be
  adhered.

- Processor can store the core column(ex: user_integration_id) mapping values in the separate database
  Dynamo DB for the future lookup and it can be refered to the other files in the process.

![architecture image](arch.png)

# Split

- Split processor can take single (.csv|.txt) file as an inputs and generate the multiple output
  files based on the configuration fields.

- The configuration files holds the number of rows to be split, number of output files to generate and the flag whether
  to include the header count.

## Build and test

```bash
$ npm run build

# run unit tests in Processor.test.ts
$ npm run test
```

You can also do a full run of your step with arbitrary inputs, outputs and parameters using the `runStep` command. This utilizes the full dcSDK code path and is useful for local development.

````bash
# Run with inputs, outputs, and parameters
$ npm run runStep -- -i myInputName=path/to/my/local/input.csv -o myOutputName=path/to/my/local/output.csv -p '{ "myParameter": "value" }'

# Specify method name and granularity if desired
$ npm run runStep -- -i myInputName=path/to/my/local/input.csv -o myOutputName=path/to/my/local/output.csv -m piiMaskOnce -g once -p '{ "myParameter": "value" }'


Note that all the code for this is present in [runLocalStep.ts](src/runLocalStep.ts) and you can modify it as desired.

## Deploy to Data Channels Dev Enviro

You will need AWS credentials in place before running, either in .aws/credentials file, or in ENV vars. Use profile `data-channels-dev-processor` or set AWS_PROFILE. Ask on #plat-data-channels for credential help if needed.

```bash
$ npm run deploy-dev
````
#   s d - d c  
 