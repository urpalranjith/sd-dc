import {
  ConfigType,
  JobStatus,
  jobWithInlineChannel,
} from "@data-channels/dcSDK";
import PIIMaskProcessor from "./PIIMaskProcessor";
import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
/**
 * This file contains the a sample configuration for the local job,
 * based on this configuration job creates and exceutes the procossor
 */

const genericJob: any = {
  guid: "1234567890",
  name: "1234567890",
  author: "",
  isDeleted: false,
  created: new Date(),
  product: "",
  status: JobStatus.Started,
  statusMsg: "",
  workspace: {
    bucket: "data-channels-work-local",
  },
  filesIn: [],
  filesOut: [],
  currentStep: "piiMask",
  steps: {
    piiMask: {
      finished: false,
    },
  },
};

const channel = {
  flow: ["piiMask"],
  steps: {
    piiMask: {
      inputs: [] as string[],
      outputs: [] as string[],
      method: "piiMask",
      processor: "local",
      granularity: "row",
      parameters: {},
    },
  },
};

function parseFileStrs(fstr: string): any[] {
  const fileInfoList: any[] = [];
  for (const fileStr of fstr.split(",")) {
    if (fileStr.includes("=")) {
      const [name, path] = fileStr.split("=");
      fileInfoList.push({
        fileIn: {
          s3: {
            key: "",
            bucket: "",
          },
          name,
        },
        path,
      });
    }
  }

  return fileInfoList;
}

// tslint:disable-next-line
(async () => {
  const fileUrls: { [name: string]: string } = {};
  if (argv["i"]) {
    const inputs = parseFileStrs(argv["i"]);
    for (const finput of inputs) {
      channel.steps.piiMask.inputs.push(finput.fileIn.name);
      genericJob["filesIn"].push(finput.fileIn);
      fileUrls[`${finput.fileIn.name}_READ`] = `file://${finput.path}`;
    }
  }
  if (argv["o"]) {
    const inputs = parseFileStrs(argv["o"]);
    for (const finput of inputs) {
      channel.steps.piiMask.outputs.push(finput.fileIn.name);
      genericJob["filesOut"].push(finput.fileIn);
      fileUrls[`${finput.fileIn.name}_READ`] = `file://${finput.path}`;
      fileUrls[`${finput.fileIn.name}_WRITE`] = `file://${finput.path}`;
      fileUrls[`${finput.fileIn.name}_OUTPUT`] = `file://${finput.path}`;
    }
  }

  if (argv["m"]) {
    channel.steps.piiMask.method = argv["m"];
  }

  if (argv["p"]) {
    try {
      const params = JSON.parse(argv["p"]);
      channel.steps.piiMask.parameters = params;
    } catch (err) {
      console.log("ERROR: parameters needs to be a json string");
    }
  }

  if (argv["g"]) {
    channel.steps.piiMask.granularity = argv["g"];
  }

  const job = jobWithInlineChannel(genericJob, channel);
  const jobConfig = job.rawConfig;
  const amendedChannelConfig = Object.assign(
    {
      guid: "",
      name: "",
      author: "",
      detailsGuid: "",
      isDeleted: false,
      created: new Date(),
      isLatest: true,
      product: "",
      configType: ConfigType.CHANNEL,
      noTaskLogs: false,
    },
    channel
  );

  console.log(
    `Processing step ${channel.steps.piiMask.method} with granularity ${channel.steps.piiMask.granularity}`
  );

  jobConfig.inlineChannel = amendedChannelConfig;
  jobConfig.currentStep = null;
  jobConfig.workspace!.fileUrls = fileUrls;
  const processor = new PIIMaskProcessor(job, { storeFilesLocal: true });
  await processor.processAll("");
  console.log(
    "-----------------------Job Run Results------------------------------"
  );
  console.log(JSON.stringify(processor.job.steps, undefined, 2));
})();
