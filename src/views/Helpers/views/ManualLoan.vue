<template>
  <v-container>
    <div>
      <div>ESTL {{ reruiredTime }}, Remaining: {{ remainingTime }}</div>
      <div class="my-5">
        uploaded {{ uploaded }} of {{ bajaj.length }} items.
      </div>
      <v-btn @click="startUpload">Start Upload</v-btn>

      <div class="mt-5">
        <v-divider></v-divider>
        <div class="my-5">Report</div>
        <h2>No pincode</h2>
        <div>
          {{ pincodenotFound }}
        </div>
        <h2>Not success</h2>
        <div>
          {{ notsuccessfull }}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
import bajaj from "../../Helpers/bajaj.json";
import bajajpincodes from "../../Helpers/bajajpincodes.json";
import moment from "moment";
export default {
  data() {
    return {
      bajaj: bajaj,
      uploaded: 0,
      bajajpincodes: bajajpincodes,
      pincodenotFound: [],
      notsuccessfull: [],
      remaining: 3853000,
    };
  },
  computed: {
    reruiredTime() {
      const duration = moment.duration(bajaj.length * 1000);
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return `${minutes} minutes and ${seconds} seconds`;
    },
    remainingTime() {
      const duration = moment.duration(this.remaining);
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return `${minutes} minutes and ${seconds} seconds`;
    },
  },
  methods: {
    async startUpload() {
      const array = bajaj;
      for (let i = 0; i < array.length; i++) {
        const x = array[i];

        const pincodedata = this.bajajpincodes.find((pin) => {
          return pin.pincode == x.address[0].pincode;
        });

        if (pincodedata) {
          await HTTP.post("finance/create/lead", {
            dob: x.dateOfBirth,
            fName: x.firstName,
            lName: x.lastName,
            mobile: x.mobileNumber,
            pincode: {
              state_id: pincodedata.state_id,
              state_name: pincodedata.state_name,
              city_id: pincodedata.city_id,
              city_name: pincodedata.city_name,
              pincode: pincodedata.pincode,
              state_name_1: pincodedata.state_name_1,
            },
            vehicle: this.formatAssetId(x.assetId),
          })
            .then(() => {
              this.remaining -= 1000;
              this.uploaded++;
            })
            .catch(() => {
              this.notsuccessfull.push(x);
              this.remaining -= 1000;
            });
        } else {
          this.pincodenotFound.push(x);
        }

        // Introduce a delay of 1000ms (1 second) between iterations
        if (i < array.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    },
    // async startUpload() {
    //   const array = bajaj;
    //   array.forEach(async (x) => {
    //     const pincodedata = this.bajajpincodes.find((pin) => {
    //       return pin.pincode == x.address[0].pincode;
    //     });
    //     if (pincodedata) {
    //       await HTTP.post("finance/create/lead", {
    //         dob: x.dateOfBirth,
    //         fName: x.firstName,
    //         lName: x.lastName,
    //         mobile: x.mobileNumber,
    //         pincode: {
    //           state_id: pincodedata.state_id,
    //           state_name: pincodedata.state_name,
    //           city_id: pincodedata.city_id,
    //           city_name: pincodedata.city_name,
    //           pincode: pincodedata.pincode,
    //           state_name_1: pincodedata.state_name_1,
    //         },
    //         vehicle: this.formatAssetId(x.assetId),
    //       })
    //         .then(() => this.uploaded++)
    //         .catch(() => this.notsuccessfull.push(x));
    //     } else {
    //       this.pincodenotFound.push(x);
    //     }
    //   });
    // },
    formatAssetId(inputString) {
      // Remove hyphens using the replace method and regular expressions
      const stringWithoutHyphens = inputString.replace(/-/g, " ");
      // Convert the string to uppercase using the toUpperCase method
      const uppercaseString = stringWithoutHyphens.toUpperCase();
      return uppercaseString;
    },
  },
};
</script>

<style></style>
