<template>
  <v-card height="100%" flat outlined>
    <v-card-title>Top States</v-card-title>
    <v-divider></v-divider>
    <v-container>
      <table>
        <tr>
          <th>State</th>
          <th>Total</th>
          <th>Approved</th>
        </tr>
        <tr v-for="(data, index) in statesWiseData" :key="index">
          <td>{{ data.state[0] }}</td>
          <td>
            {{ data.count }}
            <span v-if="data.percentage"
              >({{ data.percentage.toFixed(1) }}%)</span
            >
          </td>
          <td>
            {{ data.approvedCount }}
            ({{ ((data.approvedCount / data.count) * 100).toFixed(1) }}%)
          </td>
        </tr>
      </table>
    </v-container>
  </v-card>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data() {
    return {
      loading: false,
      statesWiseData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const { data } = await HTTP.get(
          "/drivex/v2/loans/fetch/stats/statewisedata"
        );
        this.statesWiseData = data;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #f3f3f3;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f3f3f3;
}
</style>
