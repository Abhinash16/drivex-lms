<template>
  <div>
    <v-card outlined @click="showDateTimePickerDialog = true">
      <v-container>
        <v-row>
          <v-col class="my-auto">
            <div v-if="formattedDateTime">
              {{ formattedDateTime | moment("lll") }}
            </div>
            <div v-else>Pick Date & Time</div>
          </v-col>
          <v-col class="my-auto text-right">
            <v-btn icon>
              <v-icon>mdi-clock</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-dialog v-model="showDateTimePickerDialog" max-width="330">
      <v-card>
        <v-date-picker
          v-if="!timePickerVisible"
          v-model="selectedDate"
          :min="minDate"
          :max="maxDate"
          scrollable
          no-title
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="cancel">Cancel</v-btn>
          <v-btn text color="primary" @click="showTimePicker">Next</v-btn>
        </v-date-picker>

        <v-time-picker
          v-else
          v-model="selectedTime"
          :allowed-hours="allowedHours"
          :allowed-minutes="allowedMinutes"
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="hideTimePicker">Back</v-btn>
          <v-btn text color="primary" @click="saveDateTime">OK</v-btn>
        </v-time-picker>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DateTimePicker",
  props: {
    value: {
      type: String, // expecting a formatted date-time string
      default: null,
    },
    minDate: {
      type: String,
      default: () => new Date().toISOString().substr(0, 10),
    },
    maxDate: {
      type: String,
      default: "2025-12-31",
    },
  },
  data() {
    return {
      showDateTimePickerDialog: false,
      selectedDate: this.value ? moment(this.value).format("YYYY-MM-DD") : null,
      selectedTime: this.value ? moment(this.value).format("HH:mm") : null,
      timePickerVisible: false,
    };
  },
  computed: {
    formattedDateTime() {
      if (this.selectedDate && this.selectedTime) {
        return moment(
          `${this.selectedDate} ${this.selectedTime}`,
          "YYYY-MM-DD HH:mm"
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      return this.value;
    },
  },
  methods: {
    allowedHours() {
      return true;
      // return hour >= 9 && hour <= 21; // business hours
    },
    allowedMinutes(minute) {
      return minute >= 0 && minute <= 60;
    },
    showTimePicker() {
      this.timePickerVisible = true;
    },
    hideTimePicker() {
      this.timePickerVisible = false;
    },
    saveDateTime() {
      if (this.selectedDate && this.selectedTime) {
        const dateTime = moment(
          `${this.selectedDate} ${this.selectedTime}`,
          "YYYY-MM-DD HH:mm"
        ).format("YYYY-MM-DD HH:mm:ss");
        this.$emit("input", dateTime);
      }
      this.showDateTimePickerDialog = false;
      this.timePickerVisible = false;
    },
    cancel() {
      this.showDateTimePickerDialog = false;
      this.timePickerVisible = false;
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        const date = moment(newVal);
        this.selectedDate = date.format("YYYY-MM-DD");
        this.selectedTime = date.format("HH:mm");
      }
    },
  },
  filters: {
    moment(value, format) {
      return value ? moment(value).format(format) : "";
    },
  },
};
</script>

<style scoped>
.v-card {
  cursor: pointer;
}
</style>
