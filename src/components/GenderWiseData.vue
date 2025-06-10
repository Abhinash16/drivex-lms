<template>
  <v-card height="100%" flat outlined>
    <v-card-title>Top Gender</v-card-title>
    <v-divider></v-divider>
    <v-container>
      <!-- <div
        class="d-flex justify-space-between"
        v-for="(data, index) in genderWiseData"
        :key="index"
      >
        <div class="text--disabled">{{ data.state[0] }}</div>
        <div>
          <strong>{{ data.count }}, </strong>
          <span class="success--text">{{ data.approvedCount }} </span>
        </div>
      </div> -->
      <table>
        <tr>
          <th>Gender</th>
          <th>Total</th>
          <th>Approved</th>
        </tr>
        <tr v-for="(data, index) in genderWiseData" :key="index">
          <td>{{ data.gender }}</td>
          <td>{{ data.count }}</td>
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
      genderWiseData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        const { data } = await HTTP.get(
          "/drivex/v2/loans/fetch/stats/genderwisedata"
        );
        this.genderWiseData = data;
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
