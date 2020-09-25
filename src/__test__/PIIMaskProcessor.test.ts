import { Job, JobStatus } from "@data-channels/dcSDK";
import "jest";
import PIIMaskProcessor from "../PIIMaskProcessor";
import {
  usersFileHeaderRow,
  usersFileWithPIIDataRow,
  usersFileWithoutEmailWithSpeacialCharacters,
  usersFileWithDuplicateIntegId,
  enrollmentFileHeaderRow,
  enrollmentFileMapsIntegID,
  enrollmentFileNoMatchIntegID,
  relationshipsFileHeaderRow,
  relationshipsFileWithNoMatchIntegId,
  relationshipsFileMapNoChildID,
  sectionsFileHeaderRow,
  sectionsFileNoAnonymizationRow,
} from "./piiTestInput";

describe("PIIMaskProcessor", () => {
  let piiMaskProcessor: any;
  beforeAll(async () => {
    const job = Job.fromConfig(jobConfig);
    piiMaskProcessor = new PIIMaskProcessor(job);
    await piiMaskProcessor["before_piiMask"]();
  });

  test("piiMask method users file header row", async () => {
    const result = await piiMaskProcessor["piiMask"](usersFileHeaderRow);

    expect(result).toEqual({
      outputs: {
        usersOutput: [
          "integration_id",
          "family_name",
          "middle_name",
          "given_name",
          "email",
          "secondary_email",
          "student_id",
          "user_id",
          "gender",
          "birth_dt",
          "b_phone",
          "m_phone",
          "available_ind",
          "assign_student_role",
          "allow_login",
          "home_city",
          "home_state",
          "home_zip",
          "home_county",
          "user_timezone",
        ],
      },
    });
  });

  test("Anonymize the PII data on users input", async () => {
    const result = await piiMaskProcessor["piiMask"](usersFileWithPIIDataRow);

    expect(result).toEqual({
      outputs: {
        usersOutput: [
          "i_1234_25",
          "lname_1234",
          "mname_1234",
          "fname_1234",
          "success@simulator.amazonses.com",
          "success@simulator.amazonses.com",
          "sid_1234",
          "u_1234",
          "Female",
          "1975-02-29",
          "+17031234321",
          "+17031234321",
          "availId_1234",
          "1",
          "1",
          "home_city_1234",
          "home_state_1234",
          "home_zip_1234",
          "home_county_1234",
          "America/Adak",
        ],
      },
    });
  });

  test("Check input file with special characters and email with empty value", async () => {
    const result = await piiMaskProcessor["piiMask"](
      usersFileWithoutEmailWithSpeacialCharacters
    );

    expect(result).toEqual({
      outputs: {
        usersOutput: [
          "i_1234_26",
          "lname_1234",
          "mname_1234",
          "fname_1234",
          "",
          "success@simulator.amazonses.com",
          "sid_1234",
          "u_1234",
          "Female",
          "1975-02-29",
          "+17031234321",
          "+17031234321",
          "availId_1234",
          "1",
          "1",
          "home_city_1234",
          "home_state_1234",
          "home_zip_1234",
          "home_county_1234",
          "America/Adak",
        ],
      },
    });
  });

  test("Users input file with duplicate integration_id", async () => {
    const result = await piiMaskProcessor["piiMask"](
      usersFileWithDuplicateIntegId
    );

    expect(result).toEqual({
      outputs: {
        usersOutput: [
          "i_1234_25",
          "lname_1234",
          "mname_1234",
          "fname_1234",
          "success@simulator.amazonses.com",
          "success@simulator.amazonses.com",
          "sid_1234",
          "u_1234",
          "Female",
          "1975-02-29",
          "+17031234321",
          "+17031234321",
          "availId_1234",
          "1",
          "1",
          "home_city_1234",
          "home_state_1234",
          "home_zip_1234",
          "home_county_1234",
          "America/Adak",
        ],
      },
    });
  });

  test("PIIMaskProcessor for enrollment file header row", async () => {
    const result = await piiMaskProcessor["piiMask"](enrollmentFileHeaderRow);

    expect(result).toEqual({
      outputs: {
        enrollmentOutput: [
          "course_section_integration_id",
          "user_integration_id",
          "user_role",
          "available_ind",
          "credit_hours",
          "last_access_date",
          "authoritative_status",
        ],
      },
    });
  });

  test("Mapped the user integration_id on enrollment output", async () => {
    const result = await piiMaskProcessor["piiMask"](enrollmentFileMapsIntegID);

    expect(result).toEqual({
      outputs: {
        enrollmentOutput: [
          "UNIV-SRF101-602-202002",
          "i_1234_25",
          "Instructor",
          "1",
          "1.5",
          "2016-09-20 14:04:05",
          "1",
        ],
      },
    });
  });

  test("enrollment input file - users integration id value didn't match on users file", async () => {
    const result = await piiMaskProcessor["piiMask"](
      enrollmentFileNoMatchIntegID
    );

    expect(result).toEqual({
      outputs: {
        enrollmentOutput: [
          "UNIV-SRF101-602-202002",
          "Peter.Park",
          "Instructor",
          "1",
          "1.5",
          "2016-09-20 14:04:05",
          "1",
        ],
      },
    });
  });

  test("PIIMaskProcessor for relationships file header row", async () => {
    const result = await piiMaskProcessor["piiMask"](
      relationshipsFileHeaderRow
    );

    expect(result).toEqual({
      outputs: {
        relationshipsOutput: [
          "parent_integration_id",
          "parent_role",
          "child_id",
          "child_role",
          "term_id",
        ],
      },
    });
  });

  test("Relaltionships File - mapped the user integration_id and no match found on child id", async () => {
    const result = await piiMaskProcessor["piiMask"](
      relationshipsFileWithNoMatchIntegId
    );

    expect(result).toEqual({
      outputs: {
        relationshipsOutput: [
          "i_1234_25",
          "Primary Advisor",
          "Emma.Mack",
          "Student",
          "202002",
        ],
      },
    });
  });

  test("Relationships File - No match found for child id - No Anonymization", async () => {
    const result = await piiMaskProcessor["piiMask"](
      relationshipsFileMapNoChildID
    );

    expect(result).toEqual({
      outputs: {
        relationshipsOutput: [
          "i_1234_25",
          "Primary Advisor",
          "adam.gold",
          "Student",
          "202002",
        ],
      },
    });
  });

  test("PIIMaskProcessor for sections file header row", async () => {
    const result = await piiMaskProcessor["piiMask"](sectionsFileHeaderRow);

    expect(result).toEqual({
      outputs: {
        sectionsOutput: [
          "integration_id",
          "course_section_name",
          "course_section_id",
          "start_dt",
          "end_dt",
          "term_id",
          "course_integration_id",
          "course_section_delivery",
          "maximum_enrollment_count",
          "credit_hours",
          "registration_call_number",
        ],
      },
    });
  });

  test("PIIMaskProcessor for sections file - No Anonymization", async () => {
    const result = await piiMaskProcessor["piiMask"](
      sectionsFileNoAnonymizationRow
    );

    expect(result).toEqual({
      outputs: {
        sectionsOutput: [
          "UNIV-SRF101-602-202002",
          "Canvas Course",
          "UNIV-SRF101-602-202002",
          "2020-08-10",
          "2021-01-10",
          "202002",
          "SRF101",
          "03",
          "50",
          "3.5",
          "31533",
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
  currentStep: "piiMask",
  status: JobStatus.Started,
  statusMsg: "",
  channel: {
    guid: "some-channel-guid-here",
    name: "some-channel",
  },
  filesIn: [],
  filesOut: [],
  steps: {
    piiMask: {
      finished: false,
    },
  },
};
