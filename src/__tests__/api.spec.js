import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { moodMeter, moodSchema, moodSchemaId } from "../__mocks__/testData";
import { BASE_URL } from "../constants";
import * as api from "../api";
import mockStorage from "../__mocks__/mockStorage";

const mock = new MockAdapter(axios);
global.localStorage = mockStorage();

describe("api", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should fetch meters", () => {
    mock.onGet(`${BASE_URL}/meters`).reply(200, [moodMeter]);
    //.reply(() => Promise.resolve([200, [moodMeter]]));
    expect(api.fetchMeters().then(resp => resp.data)).resolves.toEqual([
      moodMeter
    ]);
  });

  it("should fetch schemas", () => {
    mock.onGet(`${BASE_URL}/schemas`).reply(200, [moodSchema]);
    //.reply(() => Promise.resolve([200, [moodMeter]]));
    expect(api.fetchSchemas().then(resp => resp.data)).resolves.toEqual([
      moodSchema
    ]);
  });

  it("should create a meter", () => {
    const newMeterId = "5ac23a6c170200a1d6f98a3f";
    const smileyMeter = {
      name: "smiley-meter",
      widget: "smiley-faces",
      schemaId: moodSchemaId
    };
    mock.onPost(`${BASE_URL}/meters`, smileyMeter).reply(200, {
      ...smileyMeter,
      _id: { $oid: newMeterId }
    });
    expect(
      api
        .createMeter(moodSchemaId, "smiley-meter", "smiley-faces")
        .then(resp => resp.data)
    ).resolves.toEqual({
      ...smileyMeter,
      _id: { $oid: newMeterId }
    });
  });
});
