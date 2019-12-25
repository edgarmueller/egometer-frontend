export const testDate = "2018-04-16";

// string based mood meter
export const moodMeterId = "5ad45b9d77db6465aa6f469f";
export const moodSchemaId = "5ac9065704040014c266ceb3";
export const moodMeter = {
  id: moodMeterId,
  name: "mood",
  widget: "EnumMood",
  schemaId: moodSchemaId,
  color: "#cecece"
};
export const moodSchema = {
  id: moodSchemaId,
  name: "mood",
  schema: {
    type: "string",
    enum: ["bad", "down", "okayish", "good", "dabomb"]
  }
};

export const moodEntries = [
  // mood entries
  {
    id: "5abfad0f8fdd856d4c35f437",
    date: "2018-09-16",
    meterId: moodMeterId,
    value: "good"
  },
  {
    id: "5abfaf518fdd856d4c35f50e",
    date: "2018-10-15",
    meterId: moodMeterId,
    value: "bad"
  },
  {
    id: "5abfbf3b8fdd856d4c35f776",
    date: "2018-04-14",
    meterId: moodMeterId,
    value: "okayish"
  }
];

// number based counter meter
export const counterMeterId = "5ae613dbce83afba8396ddd3";
export const counterSchemaId = "5ab7c82bdf66b0d5bc1f5e26";
export const counterMeter = {
  id: counterMeterId,
  name: "counter",
  widget: "Number",
  schemaId: counterSchemaId,
  color: "#ddd"
};
export const counterSchema = {
  id: counterSchemaId,
  name: "counter",
  schema: {
    type: "number",
    minimum: 0
  }
};

export const counterEntries = [
  {
    id: "5ae61509ce83afba8396dea5",
    date: "2018-04-16",
    meterId: counterMeterId,
    value: 10
  },
  {
    id: "5ae61552ce83afba8396decd",
    date: "2018-04-15",
    meterId: counterMeterId,
    value: 20
  },
  {
    id: "5ae9febf90f3a394b168e243",
    date: "2018-04-14",
    meterId: counterMeterId,
    value: 30
  }
];
