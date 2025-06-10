<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          color="primary"
          type="day"
          v-model="focus"
          :events="events"
          @change="fetchEvents"
          @click:event="handleEventClick"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data: () => ({
    focus: "",
    events: [],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async fetchEvents({ start, end }) {
      console.log("🚀 ~ fetchEvents ~ start:", start.date);
      const events = [];

      const { data } = await HTTP.get("/drivex/calendar", {
        params: {
          start: start.date,
          end: end.date,
        },
      });

      data.forEach((element) => {
        events.push({
          name: element.name,
          start: new Date(element.start),
          end: new Date(element.end),
          color: element.color || "red",
          timed: true,
          category: "Tori Walker",
        });
      });
      this.events = events;
    },
    handleEventClick(event) {
      console.log("🚀 ~ handleEventClick ~ event:");
      // Navigate to the URL /lead/<applicationId>
      if (event.event.name) {
        this.$router.push(`/lead/${event.event.name}`);
      } else {
        console.error("No applicationId found for event:", event);
      }
    },
  },
};
</script>
