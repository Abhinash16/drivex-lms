<template>
  <v-card flat outlined>
    <v-card-title>Top Sources </v-card-title>
    <v-divider></v-divider>
    <v-container>
      <!-- <div
        class="d-flex justify-space-between"
        v-for="(data, index) in statesWiseData"
        :key="index"
      >
        <div class="text--disabled text--truncate">{{ data.source }}</div>
        <div>
          <strong>{{ data.count }}</strong>
        </div>
      </div> -->

      <table>
        <tr>
          <th>Source</th>
          <th>Total</th>
          <th>Approved</th>
        </tr>
        <tr v-for="(data, index) in statesWiseData" :key="index">
          <td>{{ data.source }}</td>
          <td>
            {{ data.count }} ({{
              ((data.count / Number(totalLeads)) * 100).toFixed(1)
            }}%)
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
      totalLeads: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const { data } = await HTTP.get(
          "/drivex/v2/loans/fetch/stats/sourcewisedata"
        );
        this.statesWiseData = data.row;
        this.totalLeads = data.total;
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
