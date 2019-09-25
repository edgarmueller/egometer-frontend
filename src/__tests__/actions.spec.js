import * as _ from "lodash";
import axios from "axios";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import MockAdapter from "axios-mock-adapter";

import * as actions from "../actions";
import { API_BASE_URL } from "../constants";
import { moodMeter, moodMeterId } from "../__mocks__/testData";
import mockStorage from "../__mocks__/mockStorage";

global.localStorage = mockStorage();
const middlewares = [thunk];
const createMockStore = configureStore(middlewares);

describe("delete meter", () => {
  it("should cause DELETE request and update local state", async () => {
    const mock = new MockAdapter(axios);
    mock
      .onDelete(`${API_BASE_URL}/meters/${moodMeterId}`)
      .reply(200, moodMeter);
    const store = createMockStore({ meters: [moodMeter] });
    await store.dispatch(actions.deleteMeter(moodMeterId));
    const storedActions = store.getActions();
    expect(_.head(storedActions).type).toBe(actions.DELETE_METER_SUCCESS);
  });
});
