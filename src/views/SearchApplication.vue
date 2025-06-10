<template>
  <v-app>
    <v-container>
      <v-text-field
        outlined
        autofocus
        v-model="search"
        label="Search Lead"
        placeholder="search lead: mobile, applicationid, firstname, lastname or email"
        @input="handleSearch"
      ></v-text-field>

      <div v-if="loading">
        <div class="text--disabled">Loading ...</div>
      </div>
      <div v-else>
        <div v-if="!search">
          <div class="text--disabled">Recent Search</div>
          <v-list>
            <v-list-item
              v-for="(item, index) in recentSearch"
              :key="item.applicationId"
            >
              <v-list-item-content @click="viewLead(item)">
                <v-list-item-title
                  >{{ item.firstName }} {{ item.lastName }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >{{ item.mobileNumber }} . {{ item.emailId }} .
                  {{ item.subStatus }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="removeRecent(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>

        <div v-else-if="items.length === 0 && search">
          <div class="text--disabled">No result found.</div>
        </div>

        <div v-else>
          <div class="text--disabled">Search Result</div>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="viewLead(item)"
            >
              <v-list-item-content>
                <v-list-item-title
                  >{{ item.firstName }} {{ item.lastName }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >{{ item.mobileNumber }} . {{ item.emailId }} .
                  {{ item.subStatus }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-magnify</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import { HTTP } from "@/services/axios";
import _ from "lodash";

export default {
  data() {
    return {
      search: "",
      items: [],
      recentSearch: [],
      loading: false,
    };
  },
  watch: {
    search: function () {
      this.loading = true;
      this.handleSearch();
    },
  },
  created() {
    const recentSearch = JSON.parse(localStorage.getItem("recentSearch"));
    if (recentSearch) {
      this.recentSearch = recentSearch;
    }
  },
  methods: {
    fetchData(query) {
      if (query) {
        this.loading = true;
        HTTP.get(`/drivex/search/application/${query}`)
          .then((response) => {
            this.items = response.data;
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.error("Error fetching data:", error);
          });
      } else {
        this.loading = false;
      }
    },
    handleSearch: _.debounce(function () {
      this.fetchData(this.search);
    }, 500),
    viewLead(lead) {
      let tempLead = {
        firstName: lead.firstName,
        lastName: lead.lastName,
        applicationId: lead.applicationId,
        subStatus: lead.subStatus,
        mobileNumber: lead.mobileNumber,
        emailId: lead.emailId,
      };
      // Update recent search if applicationId already exists
      const existingIndex = this.recentSearch.findIndex(
        (item) => item.applicationId === tempLead.applicationId
      );
      if (existingIndex !== -1) {
        this.recentSearch.splice(existingIndex, 1);
      }
      this.recentSearch.unshift(tempLead); // Add at the beginning
      localStorage.setItem("recentSearch", JSON.stringify(this.recentSearch)); // Update local storage
      this.$router.push("/lead/" + lead.applicationId);
    },
    removeRecent(index) {
      // Remove the item from local storage
      const updatedRecentSearch = [...this.recentSearch];
      updatedRecentSearch.splice(index, 1);
      this.recentSearch = updatedRecentSearch;
      localStorage.setItem("recentSearch", JSON.stringify(this.recentSearch)); // Update local storage
    },
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
