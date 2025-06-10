<template>
  <v-container>
    <div class="my-4">
      <input type="file" @change="handleFileUpload" />
    </div>
    <v-alert outlined type="success">
      .xlsx, .xlsb, .xls, etc. format is supported at the moment, to view exact
      format of xlsx file please contact tech-team.</v-alert
    >
    <div>
      <v-btn :disabled="!selectedFile" @click="convertToJson"
        >Upload File</v-btn
      >
    </div>

    <div v-if="jsonData.length > 0">
      <v-divider class="my-2"></v-divider>
      <v-row class="my-5">
        <v-col>
          <h2>Preview:</h2>
          <div>Found {{ jsonData.length }} items</div>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" @click="uploadDisbursal"
            >Confirm & Upload</v-btn
          >
        </v-col>
      </v-row>
      <v-data-table :headers="tableHeaders" :items="jsonData"></v-data-table>
    </div>
    <v-dialog persistent max-width="500" v-model="uploading">
      <v-card :loading="uploading">
        <v-container>
          {{ uploaded }}/ {{ jsonData.length }} upload success
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      selectedFile: null,
      jsonData: [],
      uploading: false,
      uploaded: 1,
      tableHeaders: [
        {
          text: "Application ID",
          value: "applicationid",
        },
        {
          text: "Customer Name",
          value: "customername",
        },
        {
          text: "Contact Number",
          value: "contact_number",
        },
        {
          text: "Customer ID",
          value: "customerid",
        },
        {
          text: "CRN",
          value: "crn",
        },
        {
          text: "TUID",
          value: "tuid",
        },
        {
          text: "Disb CM",
          value: "disb_cm",
        },
        {
          text: "SO ID",
          value: "so_id",
        },
        {
          text: "RO ID",
          value: "ro_id",
        },
        {
          text: "RO NAME",
          value: "ro_name",
        },
        {
          text: "SO NAME",
          value: "so_name",
        },
        {
          text: "Branch Name",
          value: "branchname",
        },
        {
          text: "Region",
          value: "region",
        },
        {
          text: "AMT FIN",
          value: "amtfin",
        },
        {
          text: "Types",
          value: "types",
        },
        {
          text: "Make",
          value: "make",
        },
        {
          text: "Manufacturer",
          value: "manufacturer",
        },
        {
          text: "Disbursed Amount",
          value: "disbursed_amt",
        },
        {
          text: "Disbursal Date",
          value: "disbursaldate",
        },
        {
          text: "Sales Point",
          value: "sales_point",
        },
        {
          text: "Sales Point ID",
          value: "salespointid",
        },
        {
          text: "Lead Date",
          value: "lead_date",
        },
      ],
    };
  },
  methods: {
    async uploadDisbursal() {
      this.uploading = true;
      this.uploaded = 0;

      try {
        // Use Promise.all to upload all data concurrently
        await Promise.all(
          this.jsonData.map(async (x) => {
            await HTTP.put("finance/update/disbursal", {
              data: x,
            });
            this.uploaded++;
          })
        );
      } catch (error) {
        console.error("An error occurred during upload:", error);
        // Handle error as needed
      } finally {
        this.uploading = false;
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
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
          const headers = jsonData[0].map((header) =>
            header.toLowerCase().replace(/ /g, "_")
          );

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
        };
        reader.readAsBinaryString(this.selectedFile);
      } else {
        alert("Please select an Excel file.");
      }
    },
  },
};
</script>
