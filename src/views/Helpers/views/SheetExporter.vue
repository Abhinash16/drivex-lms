<template>
  <v-container>
    <div class="my-4">
      <input type="file" @change="handleFileUpload" />
    </div>
    <v-alert outlined type="success">
      .xlsx, .xlsb, .xls, etc. format is supported at the moment, to view exact
      format of xlsx file please contact tech-team.</v-alert
    >
    <!-- <div>
      <v-btn :disabled="!selectedFile" @click="convertToJson"
        >Upload File</v-btn
      >
    </div> -->
    <div>{{ modifiedJson.length }} loans found.</div>
    <div class="text-right">
      <!-- <v-btn @click="exportNow">Start Export</v-btn> -->
      <download-csv
        v-if="modifiedJson.length > 0"
        ref="csv"
        :data="modifiedJson"
        :name="customFileName"
      >
        <v-btn color="success" class="my-4"> Download CSV </v-btn>
      </download-csv>
    </div>
    <div>
      <v-data-table :headers="headers" :items="modifiedJson"></v-data-table>
    </div>
  </v-container>
</template>

<script>
//import loanSample from "../assets/loansSample.json";
import herofinc_pincodes from "../assets/herofinc_pincodes.json";
import moment from "moment";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      //loans: loanSample,
      customFileName: `HFcrp_sheet_${moment().format("HHmm A")}.csv`,
      pincodes: herofinc_pincodes,
      modifiedJson: [],
      headers: [
        { text: "Lead Date", value: "leadDate" },
        { text: "Source", value: "Source" },
        { text: "Subchannel Code", value: "subChannelcode" },
        { text: "Mobile Number", value: "mobileNumber" },
        { text: "Title", value: "title" },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Lead Type", value: "leadType" },
        { text: "State", value: "state" },
        { text: "City", value: "city" },
        { text: "Pincode", value: "pincode" },
        { text: "Make", value: "make" },
        { text: "Model", value: "model" },
        { text: "Product Type", value: "productType" },
        { text: "Dealer Code", value: "dealerCode" },
        { text: "Dealer Name", value: "dealerName" },
      ],
      loans: [],
      selectedFile: [],
    };
  },
  mounted() {
    //this.exportNow();
  },
  props: {
    // loans: {
    //   type: Array,
    //   default: function () {
    //     return [];
    //   },
    // },
  },
  watch: {
    selectedFile() {
      this.convertToJson();
    },
  },
  methods: {
    convertToJson() {
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Extract headers from the first row and format them
          const headers = jsonData[0].map((header) => header);

          // Initialize an array to store the transformed data
          const transformedData = [];

          // Iterate through rows starting from the second row
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowData = {};

            // Create objects with lowercase and underscored keys
            for (let j = 0; j < headers.length; j++) {
              rowData[headers[j]] = row[j];
            }

            transformedData.push(rowData);
          }

          this.jsonData = transformedData;
          console.log("🚀 ~ transformedData:", transformedData);
          this.exportNow(transformedData);
        };
        reader.readAsBinaryString(this.selectedFile);
      } else {
        alert("Please select an Excel file.");
      }
    },
    exportNow(loans) {
      console.log(
        "🚀 ~ file: SheetExporter.vue:127 ~ exportNow ~ loans:",
        loans
      );
      this.modifiedJson = [];
      loans.forEach((loan) => {
        // Assuming the address array always has at least one element
        const pincode = loan.pincode;
        const pincodeData = this.pincodes.find(
          (p) => p.pincode.toString() === pincode.toString()
        );
        if (pincodeData) {
          this.modifiedJson.push({
            leadDate: moment().format("YYYY/MM/DD"),
            Source: "Online",
            subChannelcode: "Ontrack",
            mobileNumber: loan.mobileNumber,
            title: loan.gender == "Male" ? "Mr" : "Ms",
            firstName: loan.firstName,
            lastName: loan.lastName,
            leadType: "New",
            state: pincodeData.stateName,
            city: loan.city,
            pincode: pincode,
            make: "Hero",
            model: this.removeHeroAndHyphens(loan.assetId),
            productType: "TWL",
            dealerCode: pincodeData.dealerCode,
            dealerName: pincodeData.dealerName,
            //pincodeData: pincodeData || null,
          });
        }
      });
    },
    removeHeroAndHyphens(inputString) {
      return inputString.replace(/hero-|-/g, " ").trim();
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
  },
};
</script>

<style></style>
