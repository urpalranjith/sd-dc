import { Job, JobStatus } from "@data-channels/dcSDK";
import "jest";
import MergeProcessor from "../MergeProcessor";
import {
  usersFileHeaderRow,
  usersFileWithDataRow,
  usersFileWithSameHeaderRow,
  usersFileWithSameDataRow,
  usersFileWithDifferentHeaderRow,
  userHeaderRowWithoutModeParameter,
} from "./mergeTestInput";

describe("To test the merge concatenate functionality", () => {
  let mergeProcessor: any;
  let userFileHeaderRow: any;
  let userFileDataRow: any;
  beforeEach(async () => {
    const job = Job.fromConfig(jobConfig);
    mergeProcessor = new MergeProcessor(job);
    userFileHeaderRow = await mergeProcessor["merge"](usersFileHeaderRow);
    userFileDataRow = await mergeProcessor["merge"](usersFileWithDataRow);
  });
  test("Passing two different users files with same header values will concatenate results to single output file", async () => {
    const userFileWithSameHeaderRow = await mergeProcessor["merge"](
      usersFileWithSameHeaderRow
    );
    const userFileWithSameDataRow = await mergeProcessor["merge"](
      usersFileWithSameDataRow
    );
    expect(userFileHeaderRow).toEqual({
      outputs: {
        mergeOutputFile: [
          "integration_id",
          "family_name",
          "given_name",
          "email",
          "user_id",
          "available_ind",
        ],
      },
    });
    expect(userFileDataRow).toEqual({
      outputs: {
        mergeOutputFile: [
          "Yolanda.Gold",
          "goldnew",
          "yolandanew",
          "testusernew@gmail.com",
          "ygold_test",
          "1",
        ],
      },
    });
    expect(userFileWithSameHeaderRow).toEqual({
      outputs: {},
    });
    expect(userFileWithSameDataRow).toEqual({
      outputs: {
        mergeOutputFile: [
          "Egon.Adam",
          "adam",
          "egon",
          "testuser02@gmail.com",
          "eadam",
          "1",
        ],
      },
    });
  });
  test("If the second file contain uppercase headers merge will still output in to file", async () => {
    await mergeProcessor["merge"](usersFileWithSameHeaderRow);
    const userFileWithSameDataRow = await mergeProcessor["merge"](
      usersFileWithSameDataRow
    );
    expect(userFileHeaderRow).toEqual({
      outputs: {
        mergeOutputFile: [
          "integration_id",
          "family_name",
          "given_name",
          "email",
          "user_id",
          "available_ind",
        ],
      },
    });
    expect(userFileWithSameDataRow).toEqual({
      outputs: {
        mergeOutputFile: [
          "Egon.Adam",
          "adam",
          "egon",
          "testuser02@gmail.com",
          "eadam",
          "1",
        ],
      },
    });
  });
  test("If both files have different headers, merge processor will throw an error message", async () => {
    try {
      await mergeProcessor["merge"](usersFileWithDifferentHeaderRow);
    } catch (error) {
      expect(error.message).toBe(
        "The file headers do not match for the file provided in the all_users"
      );
    }
  });
  test("Test case to check if merge does not happen when concatenate / update mode parameter is not set", async () => {
    const result = await mergeProcessor["merge"](userHeaderRowWithoutModeParameter);
    expect(result).toEqual({
      outputs: {},
    });
  });
});

const jobConfig = {
  guid: "some-guid-here",
  created: new Date(),
  name: "some-job",
  isDeleted: false,
  currentStep: "merge",
  status: JobStatus.Started,
  statusMsg: "",
  channel: {
    guid: "some-channel-guid-here",
    name: "some-channel",
  },
  filesIn: [],
  filesOut: [],
  steps: {
    merge: {
      finished: false,
    },
  },
};
