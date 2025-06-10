import { HTTP, HTTP2, test } from "../../services/axios";
export default {
  state: {
    loading: false,
    currentUserLoggedIn: null,
    token: null,
  },
  getters: {
    getLoggedInUser(state) {
      return state.currentUserLoggedIn;
    },
    token: (state) => state.token,
  },
  actions: {
    updatePartnerProfile({ commit }, payload) {
      commit("UPDATE_AGENT", payload);
    },
    async initializeSession({ commit }) {
      return new Promise((resolve) => {
        if (!localStorage.getItem("Agent_token_sf")) {
          return resolve();
        } else {
          const token = localStorage.getItem("Agent_token_sf");
          commit("UPDATE_AGENT", token);
          HTTP.get("/drivex/current-user")
            .then((resp) => {
              commit("UPDATE_AGENT_INFO", resp.data);
              return resolve();
            })
            .catch(() => {
              return resolve();
            });
        }
      });
    },
    AUTH_CHECK: ({ commit }, payload) => {
      commit("AUTH_LOADING", true);
      return new Promise((resolve, reject) => {
        HTTP.post("/drivex/authorizeDrivexAgent", payload)
          .then((resp) => {
            commit("UPDATE_AGENT_INFO", resp.data.user);
            commit("UPDATE_AGENT", resp.data.token);
            resolve(resp);
          })
          .catch((err) => {
            commit("AUTH_LOADING", false);
            reject(err);
          });
      });
    },
    AUTH_LOGOUT: ({ commit }) => {
      return new Promise((resolve) => {
        commit("END_SESSION");
        resolve();
      });
    },
  },
  mutations: {
    UPDATE_AGENT: (state, data) => {
      if (data) {
        localStorage.setItem("Agent_token_sf", data);
        HTTP.defaults.headers.Authorization = "sf " + data;
        HTTP2.defaults.headers.Authorization = "sf " + data;
        test.defaults.headers.Authorization = "sf " + data;
        state.token = data;
      }
    },
    UPDATE_AGENT_INFO: (state, data) => {
      if (data) {
        state.currentUserLoggedIn = data;
      }
    },
    END_SESSION: (state) => {
      HTTP.defaults.headers.Authorization = "";
      HTTP2.defaults.headers.Authorization = "";
      test.defaults.headers.Authorization = "";
      state.token = "";
      localStorage.removeItem("Agent_token_sf");
    },
  },
};
