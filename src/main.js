import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import VueMoment from "vue-moment";
import store from "./store";
import JsonCSV from "vue-json-csv";
Vue.component("downloadCsv", JsonCSV);
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css"; // Import the default styles
import { globalFunctionsMixin } from "./mixins/globalFunctions";

if (localStorage.getItem("Agent_token_sf")) store.dispatch("initializeSession");

Vue.config.productionTip = false;
Vue.mixin(globalFunctionsMixin);

Vue.use(VueToast);
Vue.use(VueMoment);
Vue.use(moment);
Vue.filter("currency", function (value) {
  return `₹${value ? value.toFixed(2) : value}`; // You can adjust the number of decimal places as needed
});

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
