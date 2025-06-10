<template>
  <div>
    <v-container>
      <v-card outlined :loading="loading">
        <v-card-title> Closed Won ({{ totalTickets }}) </v-card-title>
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
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      limit: 10,
      offset: 0, // Track the number of records loaded
      totalTickets: 0,
      allLoaded: false, // Flag to indicate if all data has been loaded
    };
  },
  created() {
    this.fetchTableData();
  },
  methods: {
    async fetchTableData() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("drivex/leads", {
          params: {
            limit: this.limit,
            offset: this.offset,
            status: "Closed - Won",
          },
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
    loadMore() {
      this.fetchTableData();
    },
  },
};
</script>

<style>
/* Add any styles here if needed */
</style>
