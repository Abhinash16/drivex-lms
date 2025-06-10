<template>
  <div>
    <LineChartGenerator
      v-if="loaded"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
    <v-card v-else outlined height="70vh"></v-card>
  </div>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";
import { test } from "@/services/axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    type: {
      type: String,
      default: "hourly",
    },
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    type() {
      this.loadData();
    },
  },
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const { data } = await test.get(
          "/get/financeApplications/:source?type=" + this.type
        );
        this.chartData = data;
        this.loaded = true;
      } finally {
        this.loaded = true;
      }
    },
  },
  data() {
    return {
      loaded: false,
      chartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    };
  },
};
</script>
