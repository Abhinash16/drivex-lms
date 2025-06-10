<template>
  <div>
    <v-data-table
      :headers="tableHeaders"
      :items="loans"
      class="elevation-1"
      hide-default-footer
    >
      <!-- <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Loan List</v-toolbar-title>
      </v-toolbar>
    </template> -->
      <template #item="{ item }">
        <tr>
          <td>{{ item.firstName }}</td>
          <td>{{ item.mobileNumber }}</td>
          <td>{{ item.address[0].pincode }}</td>
          <td>{{ item.address[0].addressLine2 }}</td>
          <td>{{ item.address[0].addressLine1 }}</td>
          <td>{{ item.source }}</td>
          <td>{{ item.orp }}</td>
          <td>{{ item.downpayment }}</td>
          <td>{{ item.marginmoney }}</td>
          <td>{{ item.loanDetails.maxAllowedLoanAmount || "-" }}</td>
          <td>{{ item.subStatus }}</td>
          <td>{{ item.createdAt | moment("lll") }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data() {
    return {
      loans: [],
      tableHeaders: [
        { text: "Name", value: "firstName" },
        { text: "Phone", value: "mobileNumber" },
        { text: "Pincode", value: "pincode" },
        { text: "State", value: "state" },
        { text: "City", value: "city" },
        { text: "Source", value: "source" },
        { text: "ORP", value: "orp" },
        { text: "DP", value: "downpayment" },
        { text: "Loan", value: "marginmoney" },
        { text: "Sanctioned", value: "loanDetails.ScorecardEligibleAmount" },
        { text: "Status", value: "status" },
        { text: "Created At", value: "createdAt" },
      ],
    };
  },
  mounted() {
    this.fetchLoans();
  },
  watch: {
    applicationIds() {
      this.fetchLoans();
    },
  },
  props: {
    applicationIds: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    async fetchLoans() {
      let params = {
        applicationIdsToQuery: this.applicationIds,
        limit: 10,
      };
      const { data } = await HTTP.get("drivex/v2/loans/fetch/applications", {
        params,
      });
      this.loans = data.applications;
      // Make API request using this.mobileNumber as a query parameter
      // Update this.loans with the fetched data
    },
    viewLoan() {
      // Implement logic to view loan details
    },
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
