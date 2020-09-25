import { Job, JobStatus } from "@data-channels/dcSDK";
import "jest";
import SplitProcessor from "../SplitProcessor";
import {
  userHeaderRow,
  userDataRow1,
  userDataRow2,
  userDataRow3,
  userHeaderRowWithoutParam,
  userDataRowWithEmptyFields,
  userDataRowWithEmpty,
} from "./SplitInput";

describe("SplitProcessor", () => {
  test("Split users input file with only header row", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    const result = await splitProcessor["split"](userHeaderRow);
    expect(result).toEqual({
      outputs: {
        users_1: [
          "integration_id",
          "family_name",
          "given_name",
          "email",
          "user_id",
          "available_ind",
          "birth_dt",
          "assign_student_role",
        ],
        users_2: [
          "integration_id",
          "family_name",
          "given_name",
          "email",
          "user_id",
          "available_ind",
          "birth_dt",
          "assign_student_role",
        ],
      },
    });
  });

  test("Split users input with header and data rows", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    await splitProcessor["split"](userHeaderRow);
    const result = await splitProcessor["split"](userDataRow1);
    expect(result).toEqual({
      outputs: {
        users_1: [
          "1Test.Student",
          "Student",
          "Test",
          "test2@email.com",
          "tstudent",
          "1",
          "1992-01-01",
          "1",
        ],
      },
    });
  });

  test("Split users file without passing any split configuration in parameters", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    const result = await splitProcessor["split"](userHeaderRowWithoutParam);
    expect(result).toEqual({
      outputs: {},
    });
  });

  test("To test split functionality by passing multiple data rows", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    await splitProcessor["split"](userHeaderRow);
    await splitProcessor["split"](userDataRow1);
    await splitProcessor["split"](userDataRow2);
    const result = await splitProcessor["split"](userDataRow3);
    expect(result).toEqual({
      outputs: {
        users_3: [
          "3Test.Student",
          "Student",
          "Test",
          "test2@email.com",
          "tstudent",
          "1",
          "1992-01-01",
          "1",
        ],
      },
    });
  });

  test("Split users input with some empty fields in data rows", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    await splitProcessor["split"](userHeaderRow);
    await splitProcessor["split"](userDataRow1);
    await splitProcessor["split"](userDataRow2);
    const result = await splitProcessor["split"](userDataRowWithEmptyFields);
    expect(result).toEqual({
      outputs: {
        users_2: [
          "3Test.Student",
          "",
          "Test",
          "test2@email.com",
          "tstudent",
          "",
          "1992-01-01",
          "1",
        ],
      },
    });
  });

  test("To test split users input with empty row in between", async () => {
    const job = Job.fromConfig(jobConfig);
    const splitProcessor = new SplitProcessor(job);
    await splitProcessor["split"](userHeaderRow);
    await splitProcessor["split"](userDataRowWithEmpty);
    await splitProcessor["split"](userDataRow2);
    const result = await splitProcessor["split"](userDataRow3);
    expect(result).toEqual({
      outputs: {
        users_2: [
          "3Test.Student",
          "Student",
          "Test",
          "test2@email.com",
          "tstudent",
          "1",
          "1992-01-01",
          "1",
        ],
      },
    });
  });
});
const jobConfig = {
  guid: "some-guid-here",
  created: new Date(),
  name: "some-job",
  isDeleted: false,
  currentStep: "split",
  status: JobStatus.Started,
  statusMsg: "",
  channel: {
    guid: "some-channel-guid-here",
    name: "some-channel",
  },
  filesIn: [{ s3: { key: "", bucket: "" }, name: "users" }],
  filesOut: [{ s3: { key: "", bucket: "" }, name: "users_1" }],
  steps: {
    split: {
      finished: false,
    },
  },
};
