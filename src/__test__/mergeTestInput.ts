export const usersFileHeaderRow = {
  index: 1,
  raw: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
  ],
  data: {
    integration_id: "integration_id",
    family_name: "family_name",
    given_name: "given_name",
    email: "email",
    user_id: "user_id",
    available_ind: "available_ind",
  },
  json: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
  ],
  name: "users",
  parameters: {
    mode: "concatenate",
  },
};

export const usersFileWithDataRow = {
  index: 2,
  raw: [
    "Yolanda.Gold",
    "goldnew",
    "yolandanew",
    "testusernew@gmail.com",
    "ygold_test",
    "1",
  ],
  data: {
    integration_id: "Yolanda.Gold",
    family_name: "goldnew",
    given_name: "yolandanew",
    email: "testusernew@gmail.com",
    user_id: "ygold_test",
    available_ind: "1",
  },
  json: [
    "Yolanda.Gold",
    "goldnew",
    "yolandanew",
    "testusernew@gmail.com",
    "ygold_test",
    "1",
  ],
  name: "users",
  parameters: {
    mode: "concatenate",
  },
};

export const usersFileWithSameHeaderRow = {
  index: 1,
  raw: [
    "INTEGRATION_ID",
    "FAMILY_NAME",
    "GIVEN_NAME",
    "EMAIL",
    "USER_ID",
    "AVAILABLE_IND",
  ],
  data: {
    INTEGRATION_ID: "INTEGRATION_ID",
    FAMILY_NAME: "FAMILY_NAME",
    GIVEN_NAME: "GIVEN_NAME",
    EMAIL: "EMAIL",
    USER_ID: "USER_ID",
    AVAILABLE_IND: "AVAILABLE_IND",
  },
  json: [
    "INTEGRATION_ID",
    "FAMILY_NAME",
    "GIVEN_NAME",
    "EMAIL",
    "USER_ID",
    "AVAILABLE_IND",
  ],
  name: "all_users",
  parameters: {
    mode: "concatenate",
  },
};

export const usersFileWithSameDataRow = {
  index: 2,
  raw: [
    "Egon.Adam",
    "adam",
    "egon",
    "testuser02@gmail.com",
    "eadam",
    "1"
  ],
  data: {
    integration_id: "Egon.Adam",
    family_name: "adam",
    given_name: "egon",
    email: "testuser02@gmail.com",
    user_id: "eadam",
    available_ind: "1",
  },
  json: [
    "Egon.Adam",
    "adam",
    "egon",
    "testuser02@gmail.com",
    "eadam",
    "1"
  ],
  name: "all_users",
  parameters: {
    mode: "concatenate",
  },
};

export const usersFileWithDifferentHeaderRow = {
  index: 1,
  raw: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "birth_dt",
    "user_id",
    "available_ind",
    "assign_student_role",
  ],
  data: {
    integration_id: "integration_id",
    family_name: "family_name",
    given_name: "given_name",
    email: "email",
    birth_dt: "birth_dt",
    user_id: "user_id",
    available_ind: "available_ind",
    assign_student_role: "assign_student_role",
  },
  json: [
    "family_name",
    "integration_id",
    "given_name",
    "email",
    "birth_dt",
    "user_id",
    "available_ind",
    "assign_student_role",
  ],
  name: "all_users",
  parameters: {
    mode: "concatenate",
  },
};

export const userHeaderRowWithoutModeParameter = {
  index: 1,
  raw: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
  ],
  data: {
    integration_id: "integration_id",
    family_name: "family_name",
    given_name: "given_name",
    email: "email",
    user_id: "user_id",
    available_ind: "available_ind",
  },
  json: [
    "integration_id",
    "family_name",
    "middle_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
  ],
  name: "users",
  parameters: {},
};
