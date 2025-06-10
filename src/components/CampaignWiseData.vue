<template>
  <v-card flat outlined>
    <v-card-title>Top Campaigns</v-card-title>
    <v-divider></v-divider>
    <v-container>
      <div
        class="d-flex justify-space-between"
        v-for="(data, index) in statesWiseData"
        :key="index"
      >
        <div class="text--disabled text--truncate">{{ data.state }}</div>
        <div>
          <strong>{{ data.count }}</strong>
        </div>
      </div>
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
          "/drivex/v2/loans/fetch/stats/campaignwisedata"
        );
        this.statesWiseData = data;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style></style>
