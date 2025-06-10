import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import rent from "./modules/rent";
import tickets from "./modules/tickets";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    httpLoading: false,
    notificationReceived: true,
    notificationServiceAvailable: true,
    bottomSheet: false,
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: auth,
    rent: rent,
    tickets: tickets,
  },
});
