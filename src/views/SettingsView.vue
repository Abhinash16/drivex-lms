<template>
  <v-container class="py-6" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <!-- Single Main Profile Card -->
        <v-card elevation="3" :loading="loading">
          <!-- Profile Header Section -->
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" sm="8">
                <div class="d-flex align-center mb-2">
                  <v-avatar size="60" color="primary" class="mr-4">
                    <span class="white--text text-h5 font-weight-light">
                      {{
                        profileData.name
                          ? profileData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2)
                          : "NA"
                      }}
                    </span>
                  </v-avatar>
                  <div>
                    <h1 class="text-h5 font-weight-medium">
                      {{ profileData.name }}
                    </h1>
                    <div class="text-h6 text--secondary mb-1">
                      @ {{ profileData.username }}
                    </div>
                    <div class="text-body-2 text--disabled d-flex align-center">
                      <v-icon small class="mr-1">mdi-calendar</v-icon>
                      Since {{ profileData.createdAt | moment("ll") }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-right">
                <v-chip
                  :color="
                    profileData.status == 'active' ? 'success' : 'warning'
                  "
                  :text-color="
                    profileData.status == 'active' ? 'white' : 'black'
                  "
                  class="mb-3"
                >
                  <v-icon left small>
                    {{
                      profileData.status == "active"
                        ? "mdi-check-circle"
                        : "mdi-pause-circle"
                    }}
                  </v-icon>
                  {{
                    profileData.status
                      ? profileData.status.toUpperCase()
                      : "UNKNOWN"
                  }}
                </v-chip>
                <div class="text-body-2 d-flex justify-end align-center">
                  Agent ID: <strong>{{ profileData.agentId }}</strong>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <!-- Contact Information Section -->
          <div class="pa-6">
            <div class="d-flex align-center mb-4">
              <v-icon left color="primary" class="mr-2"
                >mdi-account-details</v-icon
              >
              <span class="text-h6 font-weight-medium"
                >Contact Information</span
              >
            </div>

            <div class="py-0">
              <div class="px-0 py-3 d-flex align-center">
                <div class="mr-4">
                  <v-icon color="primary">mdi-phone</v-icon>
                </div>
                <div class="flex-grow-1">
                  <div class="text-body-1">{{ profileData.mobile }}</div>
                  <div class="text-body-2 text--secondary">Mobile Number</div>
                </div>
                <div>
                  <v-btn
                    icon
                    color="primary"
                    :href="`tel:${profileData.mobile}`"
                  >
                    <v-icon>mdi-phone-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-divider class="my-2"></v-divider>

              <div class="px-0 py-3 d-flex align-center">
                <div class="mr-4">
                  <v-icon color="primary">mdi-email</v-icon>
                </div>
                <div class="flex-grow-1">
                  <div>
                    <a
                      @click="openComposeEmailInNewTab(profileData.email)"
                      class="text-decoration-none primary--text text-body-1"
                    >
                      {{ profileData.email }}
                    </a>
                  </div>
                  <div class="text-body-2 text--secondary">Email Address</div>
                </div>
                <div>
                  <v-btn
                    icon
                    color="primary"
                    :href="openComposeEmailInNewTab(profileData.email)"
                  >
                    <v-icon>mdi-email-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <v-divider></v-divider>

          <!-- Agent Settings Section -->
          <div class="pa-6">
            <v-card outlined class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div class="flex-grow-1 mr-4">
                  <div class="text-h6 font-weight-medium mb-1">
                    <v-icon left color="primary">mdi-account-multiple</v-icon>
                    Lead Assignment
                  </div>
                  <div class="text-body-2 text--secondary">
                    {{
                      pauseLeadAssignment
                        ? "Auto assignment is currently enabled"
                        : "Auto assignment is currently disabled"
                    }}
                  </div>
                </div>
                <v-switch
                  v-model="pauseLeadAssignment"
                  :true-value="true"
                  :false-value="false"
                  color="primary"
                  inset
                  hide-details
                ></v-switch>
              </div>
            </v-card>
          </div>

          <v-divider></v-divider>

          <!-- Reset Password Section -->
          <div class="pa-0">
            <v-expansion-panels flat tile>
              <v-expansion-panel>
                <v-expansion-panel-header class="px-6 py-4">
                  <div class="d-flex align-center">
                    <v-icon class="mr-3" color="warning">mdi-lock-reset</v-icon>
                    <div>
                      <div class="text-h6 font-weight-medium">
                        Reset Password
                      </div>
                      <div class="text-body-2 text--secondary">
                        Update your account password for security
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-6 pb-6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="password"
                        type="password"
                        label="New Password"
                        placeholder="Enter your new password"
                        outlined
                        dense
                        clearable
                        prepend-inner-icon="mdi-lock"
                        counter="50"
                        :rules="[
                          (v) => !!v || 'Password is required',
                          (v) =>
                            (v && v.length >= 6) ||
                            'Password must be at least 6 characters',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                      <div class="d-flex justify-end align-center">
                        <v-btn
                          color="warning"
                          :disabled="password.length < 6"
                          @click="resetPassword"
                          depressed
                          :loading="loading"
                          rounded
                          large
                        >
                          <v-icon left>mdi-lock-reset</v-icon>
                          Reset Password
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <div>
      <v-snackbar
        v-model="successSnackbar"
        color="success"
        timeout="1000"
        top
        right
      >
        Updated successfully.
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      tab: 0,
      profileData: "",
      pauseLeadAssignment: false,
      password: "",
      successSnackbar: false,
      loading: false,
    };
  },
  watch: {
    async pauseLeadAssignment() {
      if (this.pauseLeadAssignment !== this.profileData.pauseLeadAssignment) {
        try {
          await HTTP.put("drivex/current-user/pauseLeadAssignment", {
            pauseLeadAssignment: this.pauseLeadAssignment,
          });
          this.successSnackbar = true;
          this.loadProfile();
        } catch (error) {
          // console.error("Pause lead assignment failed:", error);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text:
              error?.response?.data?.message ||
              "Something went wrong while updating lead assignment status.",
            confirmButtonText: "OK",
          });
        }
      }
    },
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    async resetPassword() {
      if (this.password.length < 6) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Password",
          text: "Password must be at least 6 characters long.",
          confirmButtonText: "OK",
        });
        return;
      }

      this.loading = true;
      try {
        const response = await HTTP.put("drivex/current-user/update-password", {
          password: this.password,
        });

        this.password = "";

        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text:
            response?.data?.message ||
            "Your password has been successfully updated.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error updating password:", error);

        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    async loadProfile() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("/drivex/current-user");
        this.profileData = data;
        this.pauseLeadAssignment = data.pauseLeadAssignment;
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        this.loading = false;
      }
    },

    openComposeEmailInNewTab(email) {
      const emailAddress = email; // Replace with the recipient's email address
      const subject = "Ontrack <> Carinfo"; // Replace with the subject of the email (optional)
      const body = ""; // Replace with the body of the email (optional)
      // Use encodeURIComponent to encode special characters in the email subject and body.
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);
      // Create the mailto link with the email address, subject, and body (if provided).
      return `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
    },
  },
};
</script>

<style></style>
