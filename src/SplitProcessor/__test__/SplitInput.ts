export const userHeaderRow = {
  index: 1,
  name: "users",
  raw: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
    "birth_dt",
    "assign_student_role",
  ],
  data: {
    integration_id: "integration_id",
    family_name: "family_name",
    given_name: "given_name",
    email: "email",
    user_id: "user_id",
    available_ind: "available_ind",
    birth_dt: "birth_dt",
    assign_student_role: "assign_student_role",
  },
  parameters: {
    splitRowCount: "1",
    isIncludeHeaderCount: true,
    splitOutFileCount: 2,
  },
};

export const userDataRow1 = {
  index: 2,
  raw: [
    "1Test.Student",
    "Student",
    "Test",
    "test2@email.com",
    "tstudent",
    "1",
    "1992-01-01",
    "1",
  ],
  data: {
    integration_id: "1Test.Student",
    family_name: "Student",
    given_name: "Test",
    email: "test2@email.com",
    user_id: "tstudent",
    available_ind: "1",
    birth_dt: "1992-01-01",
    assign_student_role: "1",
  },
  parameters: {
    splitRowCount: "2",
    isIncludeHeaderCount: false,
    splitOutFileCount: 2,
  },
  name: "users",
};

export const userHeaderRowWithoutParam = {
  index: 1,
  name: "users",
  raw: [
    "integration_id",
    "family_name",
    "given_name",
    "email",
    "user_id",
    "available_ind",
    "birth_dt",
    "assign_student_role",
  ],
  data: {
    integration_id: "integration_id",
    family_name: "family_name",
    given_name: "given_name",
    email: "email",
    user_id: "user_id",
    available_ind: "available_ind",
    birth_dt: "birth_dt",
    assign_student_role: "assign_student_role",
  },
};

export const userDataRow2 = {
  index: 3,
  raw: [
    "2Test.Student",
    "Student",
    "Test",
    "test2@email.com",
    "tstudent",
    "1",
    "1992-01-01",
    "1",
  ],
  data: {
    integration_id: "2Test.Student",
    family_name: "Student",
    given_name: "Test",
    email: "test2@email.com",
    user_id: "tstudent",
    available_ind: "1",
    birth_dt: "1992-01-01",
    assign_student_role: "1",
  },
  parameters: {
    splitRowCount: "2",
    isIncludeHeaderCount: true,
    splitOutFileCount: 2,
  },
  name: "users",
};

export const userDataRow3 = {
  index: 3,
  raw: [
    "3Test.Student",
    "Student",
    "Test",
    "test2@email.com",
    "tstudent",
    "1",
    "1992-01-01",
    "1",
  ],
  data: {
    integration_id: "3Test.Student",
    family_name: "Student",
    given_name: "Test",
    email: "test2@email.com",
    user_id: "tstudent",
    available_ind: "1",
    birth_dt: "1992-01-01",
    assign_student_role: "1",
  },
  parameters: {
    splitRowCount: "2",
    isIncludeHeaderCount: true,
    splitOutFileCount: 2,
  },
  name: "users",
};

export const userDataRowWithEmptyFields = {
  index: 2,
  name: "users",
  raw: [
    "3Test.Student",
    "",
    "Test",
    "test2@email.com",
    "tstudent",
    "",
    "1992-01-01",
    "1",
  ],
  data: {
    integration_id: "3Test.Student",
    family_name: "",
    given_name: "Test",
    email: "test2@email.com",
    user_id: "tstudent",
    available_ind: "",
    birth_dt: "1992-01-01",
    assign_student_role: "1",
  },
  parameters: {
    splitRowCount: "5",
    isIncludeHeaderCount: false,
    splitOutFileCount: 2,
  },
};

export const userDataRowWithEmpty = {
  index: 1,
  name: "users",
  raw: [],
  data: {},
  parameters: {
    splitRowCount: "5",
    isIncludeHeaderCount: false,
    splitOutFileCount: 2,
  },
};
