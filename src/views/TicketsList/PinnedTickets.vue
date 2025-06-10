<template>
  <div>
    <v-container>
      <v-card outlined :loading="loading">
        <v-card-title>Pinned Leads ({{ totalTickets }})</v-card-title>

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
        <v-pagination
          class="my-4"
          v-model="page"
          :length="totalTickets / limit"
        ></v-pagination>
      </v-card>
    </v-container>
    <v-overlay v-model="overlayLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
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
      page: 0,
      totalTickets: 0,
      overlayLoading: false,
    };
  },
  created() {
    this.fetchTableData();
  },
  watch: {},
  methods: {
    async fetchTableData() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("drivex/leads-pinned", {
          params: {
            limit: 10,
            offset: this.limit * this.page,
          },
        });
        this.tableData = data.tickets;
        this.totalTickets = data.totalTickets;
        this.page++;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
