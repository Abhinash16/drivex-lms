<template>
  <v-container fluid>
    <v-card v-if="localAgent" outlined class="pa-4 rounded-lg">
      <v-card-text>
        <v-row dense>
          <!-- Name -->
          <v-col cols="12" md="5">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Name</div>
                <div class="text-body-1 font-weight-bold">
                  {{ localAgent.name }}
                </div>
              </div>
              <v-btn small icon color="primary" @click="editDialog('name')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- Mobile -->
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Mobile</div>
                <div class="text-body-1 font-weight-bold">
                  {{ localAgent.mobile }}
                </div>
              </div>
              <v-btn small icon color="primary" @click="editDialog('mobile')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- Username -->
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Username</div>
                <div class="text-body-1 font-weight-bold">
                  {{ localAgent.username }}
                </div>
              </div>
              <v-btn small icon color="primary" @click="editDialog('username')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>
          </v-col>

          <v-spacer></v-spacer>
          <!-- Email -->
          <v-col cols="12" md="5">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Email</div>
                <div class="text-body-1 font-weight-bold">
                  {{ localAgent.email }}
                </div>
              </div>
              <v-btn small icon color="primary" @click="editDialog('email')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- Access Level -->
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Access Level</div>
                <div class="text-body-1 font-weight-bold">
                  {{ localAgent.accessLevel }}
                </div>
              </div>
              <v-btn
                small
                icon
                color="primary"
                @click="editDialog('accessLevel')"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>

            <!-- Password -->
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="caption grey--text">Password</div>
                <div class="text-body-1 font-weight-bold">*************</div>
              </div>
              <v-btn small icon color="primary" @click="editDialog('password')">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <v-divider class="my-2"></v-divider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card :loading="loading">
        <v-container>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Edit {{ propertyEditing }}
            </span>
            <v-btn icon @click="cancel()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="pt-4">
            <v-text-field
              v-model="editingPropertyValue"
              outlined
              dense
              :label="propertyEditing"
            ></v-text-field>
          </div>
          <div class="d-flex justify-end mt-4">
            <v-btn text large rounded depressed class="mr-2" @click="cancel()"
              >Cancel</v-btn
            >
            <v-btn
              color="primary"
              large
              rounded
              depressed
              :disabled="editingPropertyReference === editingPropertyValue"
              @click="saveChanges()"
            >
              Save changes
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="propertyChanged" max-width="400">
      <v-card class="rounded-lg pa-4">
        <div class="text-h6 font-weight-medium mb-2">
          Unsaved changes will be lost
        </div>
        <div class="text-body-2 mb-4">
          You have unsaved changes. Click "Cancel" to go back and save them.
        </div>
        <v-card-actions class="justify-end">
          <v-btn text small @click="propertyChanged = false">Cancel</v-btn>
          <v-btn color="primary" small @click="continueWithoutSaving">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      propertyEditing: null,
      editingPropertyValue: null,
      editingPropertyReference: null,
      propertyChanged: false,
      localAgent: { ...this.agent },
    };
  },
  props: {
    agent: Object,
  },
  mounted() {},
  methods: {
    editDialog(property) {
      switch (property) {
        case "email":
          this.propertyEditing = "Email";
          this.editingPropertyValue = this.localAgent.email;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "mobile":
          this.propertyEditing = "Mobile";
          this.editingPropertyValue = this.localAgent.mobile;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "name":
          this.propertyEditing = "Name";
          this.editingPropertyValue = this.localAgent.name;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "username":
          this.propertyEditing = "Username";
          this.editingPropertyValue = this.localAgent.username;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "password":
          this.propertyEditing = "Password";
          this.editingPropertyValue = null;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "accessLevel":
          this.propertyEditing = "Access Level";
          this.editingPropertyValue = this.localAgent.accessLevel;
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
          case "Email":
            payload.email = this.editingPropertyValue;
            break;

          case "Mobile":
            payload.mobile = this.editingPropertyValue;
            break;

          case "Username":
            payload.username = this.editingPropertyValue;
            break;

          case "Name":
            payload.name = this.editingPropertyValue;
            break;

          case "Password":
            payload.password = this.editingPropertyValue;
            break;

          case "Access Level":
            payload.accessLevel = this.editingPropertyValue;
            break;
        }

        const { data } = await HTTP.post(
          "/drivex/edit/agent/" + this.agent._id,
          payload
        );

        console.log("🚀 ~ saveChanges ~ data:", data);
        this.localAgent = data;
        this.$emit("update-agent", this.localAgent);
        console.log("🚀 ~ saveChanges ~ data:", data);

        Swal.fire({
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
  },
};
</script>

<style scoped></style>
