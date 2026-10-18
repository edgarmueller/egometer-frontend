import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { moodMeter } from "../__mocks__/fixtures";
import { API_BASE_URL } from "../constants";
import * as api from ".";
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

  it("should create a meter of a type", async () => {
    mock
      .onPost(`${API_BASE_URL}/meters`, {
        type: "mood",
        name: "mood",
        color: "#cecece",
      })
      .reply(201, moodMeter);
    const response = await api.createMeter("mood", "mood", "#cecece");
    expect(response.data).toEqual(moodMeter);
  });

  it("should only send editable fields when updating a meter", async () => {
    mock
      .onPatch(`${API_BASE_URL}/meters/${moodMeter.id}`)
      .reply((config) => [200, { ...moodMeter, ...JSON.parse(config.data) }]);
    await api.updateMeter({
      ...moodMeter,
      name: "Feeling",
      dailyGoal: 3,
      weeklyGoal: 5,
      tagGoals: [],
    });
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({
      name: "Feeling",
      color: "#cecece",
      weeklyGoal: 5,
    });
  });

  it("should clear goals out of range", async () => {
    mock
      .onPatch(`${API_BASE_URL}/meters/n`)
      .reply(200, { id: "n", type: "number" });
    await api.updateMeter({
      id: "n",
      type: "number",
      name: "Steps",
      dailyGoal: 0,
      weeklyGoal: 10,
    });
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({
      name: "Steps",
      dailyGoal: null,
      weeklyGoal: null,
    });
  });

  it("should send the tag goals of activities meters", async () => {
    mock
      .onPatch(`${API_BASE_URL}/meters/a`)
      .reply(200, { id: "a", type: "activities" });
    const meter = {
      id: "a",
      type: "activities",
      name: "Activities",
      options: ["sports", "work"],
      weeklyGoal: 3,
      tagGoals: [
        { tag: "sports", timesPerWeek: 3 },
        { tag: "work", timesPerWeek: 0 },
      ],
    };
    await api.updateMeter(meter);
    await api.updateMeter({ ...meter, tagGoals: [] });
    expect(JSON.parse(mock.history.patch[0].data)).toEqual({
      name: "Activities",
      options: ["sports", "work"],
      tagGoals: [{ tag: "sports", timesPerWeek: 3 }],
    });
    expect(JSON.parse(mock.history.patch[1].data).tagGoals).toBeNull();
  });

  it("should fetch the entries of a month", async () => {
    mock
      .onGet(`${API_BASE_URL}/entries?from=2026-02-01&to=2026-02-28`)
      .reply(200, []);
    const response = await api.fetchEntries(2026, "2");
    expect(response.data).toEqual([]);
  });

  it("should fetch the entries of an ISO week", async () => {
    // week 1 of 2026 starts on Monday, December 29th 2025
    mock
      .onGet(`${API_BASE_URL}/entries?from=2025-12-29&to=2026-01-04`)
      .reply(200, []);
    const response = await api.fetchEntriesByWeek(2026, 1);
    expect(response.data).toEqual([]);
  });

  it("should only send an Authorization header with a token", async () => {
    mock.onGet(`${API_BASE_URL}/meters`).reply(200, []);
    await api.fetchMeters();
    localStorage.setItem("egometer.token", "the-token");
    await api.fetchMeters();
    localStorage.removeItem("egometer.token");
    expect(mock.history.get.map((r) => r.headers.Authorization)).toEqual([
      undefined,
      "Bearer the-token",
    ]);
  });

  it("should put and delete the entry of a day", async () => {
    const entry = {
      id: "e",
      meterId: moodMeter.id,
      date: "2026-03-01",
      value: "good",
    };
    const url = `${API_BASE_URL}/meters/${moodMeter.id}/entries/2026-03-01`;
    mock.onPut(url, { value: "good" }).reply(200, entry);
    mock.onDelete(url).reply(204);
    expect((await api.updateEntry(entry)).data).toEqual(entry);
    expect((await api.deleteEntry(entry)).data).toEqual(entry);
  });
});
