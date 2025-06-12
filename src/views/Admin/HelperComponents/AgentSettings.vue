<template>
  <div>
    <v-container v-if="localAgent">
      <v-card outlined class="rounded-lg">
        <v-container class="pa-4">
          <div class="mb-4">
            <strong>Status:</strong>
            <v-chip
              outlined
              :color="
                localAgent.status === 'active' ? 'green darken-1' : 'grey'
              "
              text-color="dark"
              class="ml-2 mr-2"
            >
              {{ localAgent.status }}
            </v-chip>
            <v-btn icon small @click="editDialog('status')">
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
          </div>

          <div>
            <strong>Role:</strong>
            <span class="ml-2 mr-2">{{ roleFormatted }}</span>
            <v-btn icon small @click="editDialog('role')">
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-container>

    <!-- Edit Dialog -->
    <v-dialog scrollable max-width="500" v-model="dialog" persistent>
      <v-card>
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-h6 font-weight-medium primary--text">
              Edit {{ propertyEditing }}
            </span>
            <v-btn icon @click="cancel()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div>
            <div
              v-if="propertyEditing === 'Status'"
              class="d-flex align-center justify-space-between"
            >
              <span>{{ editingPropertyValue ? "Active" : "Inactive" }}</span>
              <v-switch v-model="editingPropertyValue" inset></v-switch>
            </div>
            <div v-else>
              <v-select
                v-model="editingPropertyValue"
                :items="roles"
                :item-text="'role'"
                :item-value="'role'"
                label="Select Role"
                outlined
                prepend-inner-icon="mdi-account-badge"
              ></v-select>
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn text rounded large class="mr-2" @click="cancel()">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              rounded
              large
              depressed
              :disabled="editingPropertyReference === editingPropertyValue"
              @click="saveChanges()"
            >
              <v-icon left>mdi-check</v-icon>
              Save Changes
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="propertyChanged" max-width="400">
      <v-card>
        <v-container class="pa-4">
          <div class="text-h6 mb-2">Unsaved Changes</div>
          <p class="mb-4">
            You have unsaved changes. Click Cancel to go back and save them, or
            OK to discard.
          </p>
          <div class="d-flex justify-end">
            <v-btn text class="mr-2" @click="propertyChanged = false"
              >Cancel</v-btn
            >
            <v-btn color="primary" @click="continueWithoutSaving">OK</v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      dialog: false,
      propertyEditing: null,
      editingPropertyValue: null,
      editingPropertyReference: null,
      propertyChanged: false,
      roles: [],
      localAgent: { ...this.agent },
      loading: false,
    };
  },
  props: {
    agent: Object,
  },
  mounted() {
    // console.log("Local Agent ", this.localAgent);
    this.fetchRoles();
  },
  methods: {
    editDialog(property) {
      switch (property) {
        case "status":
          this.propertyEditing = "Status";
          this.editingPropertyValue =
            this.agent.status == "active" ? true : false;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "role":
          this.propertyEditing = "Role";
          this.editingPropertyValue = this.agent.role;
          this.editingPropertyReference = this.editingPropertyValue;
          break;
      }
      this.dialog = true;
    },

    cancel() {
      if (this.editingPropertyReference != this.editingPropertyValue)
        this.propertyChanged = true;
      else this.dialog = false;
    },

    continueWithoutSaving() {
      this.propertyChanged = false;
      this.dialog = false;
    },

    async saveChanges() {
      this.loading = true;
      try {
        let payload = {};
        switch (this.propertyEditing) {
          case "Status":
            payload.status = this.editingPropertyValue ? "active" : "inactive";
            break;

          case "Role":
            payload.role = this.editingPropertyValue;
            break;
        }
        const { data } = await HTTP.post(
          "/drivex/edit/agent/" + this.localAgent._id,
          payload
        );
        this.localAgent = data;
        this.$emit("update-agent", this.localAgent);
        console.log("🚀 ~ saveChanges ~ data:", data);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated successfully!",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log("🚀 ~ saveChanges ~ error:", error);
        Swal.fire({
          icon: "error",
          text:
            error.response?.data?.error ||
            error.message ||
            "Something went wrong. Please try again.",
          title: "Failed",
          confirmButtonText: "OK",
        });
      } finally {
        this.dialog = false;
        this.loading = false;
      }
    },

    async fetchRoles() {
      try {
        const { data } = await HTTP.get("/drivex/roles");
        this.roles = data;
        console.log("Roles fetched:", this.roles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    },
  },
  computed: {
    roleFormatted() {
      return this.localAgent.role.toUpperCase();
    },
  },
};
</script>

<style scoped>
.v-dialog {
  width: 50%;
}
</style>
