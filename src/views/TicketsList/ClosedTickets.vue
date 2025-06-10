<template>
  <div>
    <v-container>
      <v-card outlined :loading="loading">
        <v-card-title>Closed Leads ({{ totalTickets }})</v-card-title>
        <v-tabs>
          <v-tab @click="updateExpiryStatus('all')"> All </v-tab>
          <v-tab
            @click="updateExpiryStatus(data._id)"
            v-for="(data, index) in avilableScheduleFilters"
            :key="index"
            >{{ data._id }} ({{ data.count }})</v-tab
          >
        </v-tabs>
        <v-simple-table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone</th>
              <th scope="col">Type</th>
              <th scope="col">Model</th>
              <th scope="col">Reg No</th>
              <th scope="col">Stage</th>
              <th scope="col">Call Status</th>
              <th scope="col">Assigned to</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in tableData" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                {{ data.customer_name }}
                <span
                  class="success--text"
                  v-if="data.currentStage == 'Fresh Lead'"
                >
                  <strong>- new*</strong>
                </span>
              </td>
              <td>
                <a :href="'tel:' + data.customer_mobile">{{
                  data.customer_mobile
                }}</a>
              </td>
              <td>
                {{ data.enquiry_type }}
              </td>
              <td>
                {{ data.model }}
              </td>
              <td>{{ data.registration_number }}</td>
              <td :style="{ color: getStatusColor(data.currentStage) }">
                <strong>{{ data.currentStage }}</strong>
              </td>
              <td :style="{ color: getCallStatusColor(data.callStatus) }">
                <strong>{{ data.callStatus }}</strong>
              </td>
              <td>{{ data.assignedTo ? data.assignedTo : "unassigned" }}</td>
              <td>
                <v-btn
                  :href="'/lead/' + data.applicationId"
                  target="_blank"
                  icon
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <v-container>
          <v-btn
            v-if="!allLoaded"
            text
            @click="loadMore"
            class="my-4"
            :disabled="loading"
          >
            Load More
          </v-btn>

          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="my-4"
          ></v-progress-circular>

          <div v-if="allLoaded" type="success" class="my-4">
            🎉 You're all caught up. 🎉
          </div>
        </v-container>
      </v-card>
    </v-container>
    <v-overlay v-model="overlayLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import moment from "moment"; // Assuming moment.js is used for date formatting

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      limit: 10,
      offset: 0, // This will keep track of how many records we've already loaded
      totalTickets: 0,
      allLoaded: false, // Flag to indicate if all data has been loaded
      expiryStatus: "all",
      overlayLoading: false,
      avilableScheduleFilters: [],
    };
  },
  created() {
    this.fetchTableData();
    this.fetchAvailableFilters();
  },
  methods: {
    async fetchTableData() {
      this.loading = true;
      try {
        let paramsPayload = {
          limit: this.limit,
          offset: this.offset,
        };
        if (this.expiryStatus != "all") {
          paramsPayload.reasons = [this.expiryStatus];
        }
        const { data } = await HTTP.get("drivex/leads-closed", {
          params: paramsPayload,
        });

        this.tableData.push(...data.tickets); // Append new data to the existing data
        this.totalTickets = data.totalTickets;
        this.offset += this.limit; // Increase the offset for the next load

        if (this.tableData.length >= this.totalTickets) {
          this.allLoaded = true; // If all records are loaded, set the flag
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchAvailableFilters() {
      this.overlayLoading = true;
      try {
        const { data } = await HTTP.get("drivex/leads-closed/filters");
        this.avilableScheduleFilters = data;
      } finally {
        this.overlayLoading = false;
      }
    },
    loadMore() {
      this.fetchTableData();
    },
    updateExpiryStatus(status) {
      this.expiryStatus = status;
      this.offset = 0;
      this.tableData = [];
      this.allLoaded = false;
      this.fetchTableData();
    },
  },
  filters: {
    moment: function (date, format) {
      return moment(date).format(format);
    },
  },
};
</script>

<style>
/* Add any styles here if needed */
</style>
