import { HTTP } from "../../services/axios";

export default {
  state: {
    stagesFilters: [],
  },
  getters: {
    getStagesFilters: (state) => state.stagesFilters,
  },
  mutations: {
    UPDATE_STAGES_FILTER: (state, data) => {
      if (data) {
        state.stagesFilters = data;
      }
    },
  },
  actions: {
    getLeadStagesList({ commit }) {
      return new Promise((resolve, reject) => {
        HTTP.get("/drivex/leads/utils/filters")
          .then((resp) => {
            commit("UPDATE_STAGES_FILTER", resp.data);
            resolve(resp);
          })
          .catch((err) => {
            commit("AUTH_LOADING", false);
            reject(err);
          });
      });
    },
  },
};
