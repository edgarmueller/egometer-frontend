import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { moodMeter, moodSchema, moodSchemaId } from "../__mocks__/testData";
import { API_BASE_URL } from "../constants";
import * as api from "../api";
import mockStorage from "../__mocks__/mockStorage";

const mock = new MockAdapter(axios);
global.localStorage = mockStorage();

describe("api", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should fetch meters", async () => {
    mock.onGet(`${API_BASE_URL}/meters`).reply(200, [moodMeter]);
    const meters = await api.fetchMeters();
    expect(meters.data).toEqual([moodMeter]);
  });

  it("should fetch schemas", async () => {
    mock.onGet(`${API_BASE_URL}/schemas`).reply(200, [moodSchema]);
    const schemas = await api.fetchSchemas();
    expect(schemas.data).toEqual([moodSchema]);
  });

  it("should create a meter", async () => {
    const newMeterId = "5ac23a6c170200a1d6f98a3f";
    const smileyMeter = {
      name: "smiley-meter",
      widget: "smiley-faces",
      schemaId: moodSchemaId
    };
    mock.onPost(`${API_BASE_URL}/meters`, smileyMeter).reply(200, {
      ...smileyMeter,
      _id: { $oid: newMeterId }
    });
    const response = await api.createMeter(
      moodSchemaId,
      "smiley-meter",
      "smiley-faces"
    );
    expect(response.data).toEqual({
      ...smileyMeter,
      _id: { $oid: newMeterId }
    });
  });
});
