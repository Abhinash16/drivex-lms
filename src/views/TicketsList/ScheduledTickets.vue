<template>
  <v-container fluid>
    <v-card outlined class="rounded-lg" :loading="loading">
      <v-card-title
        ><v-icon left color="primary" class="mr-2"
          >mdi-calendar-arrow-left</v-icon
        >Rescheduled Leads ({{ totalTickets }})</v-card-title
      >
      <v-tabs>
        <v-tab
          @click="updateExpiryStatus(data.name)"
          v-for="(data, index) in avilableScheduleFilters"
          :key="index"
          >{{ data.name }} ({{ data.count }})</v-tab
        >
      </v-tabs>

      <v-divider></v-divider>

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
            <td>{{ index + 1 }}</td>
            <td>
              {{ data.customer_name }}
              <v-chip
                v-if="data.currentStage === 'Fresh Lead'"
                color="success"
                text-color="white"
                x-small
                class="ml-1"
              >
                new*
              </v-chip>
            </td>
            <td>
              {{ data.customer_mobile }}
            </td>
            <td>
              <v-chip outlined small>{{ data.enquiry_type }}</v-chip>
            </td>
            <td>{{ data.model }}</td>
            <td>{{ data.registration_number }}</td>
            <td>
              <v-chip
                small
                :color="getStatusColor(data.currentStage)"
                text-color="white"
              >
                {{ data.currentStage }}
              </v-chip>
            </td>
            <td>
              <v-chip
                small
                :color="getCallStatusColor(data.callStatus)"
                text-color="white"
              >
                {{ data.callStatus }}
              </v-chip>
            </td>
            <td>
              <v-chip
                small
                :color="data.assignedTo ? 'green lighten-2' : 'grey lighten-1'"
                :text-color="data.assignedTo ? 'white' : 'black'"
              >
                {{ data.assignedTo || "Unassigned" }}
              </v-chip>
            </td>
            <td>
              <v-btn
                :href="'/lead/' + data.applicationId"
                target="_blank"
                icon
                color="primary"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-divider></v-divider>

      <v-card-text class="text-center">
        <div v-if="allLoaded" class="text-subtitle-2 mt-4 mb-2">
          🎉 You're all caught up. 🎉
        </div>

        <v-btn
          text
          color="primary"
          class="mt-2"
          v-else
          @click="loadMore"
          :disabled="loading"
        >
          Load More
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
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
      avilableScheduleFilters: [],
    };
  },
  created() {
    this.fetchTableData();
  },
  methods: {
    async fetchTableData() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("drivex/leads-scheduled", {
          params: {
            limit: this.limit,
            offset: this.offset,
            expiryStatus: this.expiryStatus,
          },
        });

        this.tableData.push(...data.tickets); // Append new data to the existing data
        this.totalTickets = data.totalTickets;
        this.avilableScheduleFilters = data.avilableScheduleFilters;
        this.offset += this.limit; // Increase the offset for the next load

        if (this.tableData.length >= this.totalTickets) {
          this.allLoaded = true; // If all records are loaded, set the flag
        }
      } finally {
        this.loading = false;
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
