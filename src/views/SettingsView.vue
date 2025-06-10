<template>
  <v-container class="py-10">
    <v-card flat max-width="800" class="mx-auto">
      <v-container>
        <v-row>
          <v-col>
            <div class="text-h5">
              {{ profileData.name }}
            </div>
            <div>@ {{ profileData.username }}</div>
            <div class="text--disabled">
              Since, {{ profileData.createdAt | moment("ll") }}
            </div>
          </v-col>
          <v-col class="text-right">
            <v-chip
              small
              outlined
              :color="profileData.status == 'active' ? 'success' : ''"
            >
              {{ profileData.status }}
            </v-chip>
            <div class="my-2 text--disabled">
              Agent ID: {{ profileData.agentId }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div>{{ profileData.mobile }}</div>

        <a :href="openComposeEmailInNewTab(profileData.email)">
          {{ profileData.email }}
        </a>

        <v-divider class="my-4"></v-divider>
        <div class="my-5">
          <v-switch
            v-model="pauseLeadAssignment"
            inset
            :label="`Deactivate auto assignment of new leads.`"
            :true-value="true"
            :false-value="false"
          ></v-switch>
        </div>

        <v-expansion-panels mandatory>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Reset Password
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>
                <v-text-field
                  v-model="password"
                  placeholder="enter new password"
                ></v-text-field>
                <v-btn
                  @click="resetPassword"
                  :disabled="password.length < 6"
                  color="primary"
                  >Reset</v-btn
                >
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data() {
    return {
      tab: 0,
      profileData: "",
      pauseLeadAssignment: false,
      password: "",
    };
  },
  watch: {
    async pauseLeadAssignment() {
      if (this.pauseLeadAssignment != this.profileData.pauseLeadAssignment) {
        try {
          await HTTP.put("drivex/current-user/pauseLeadAssignment", {
            pauseLeadAssignment: this.pauseLeadAssignment,
          });
          alert("Updated");
          this.loadProfile();
        } catch {
          alert("something went wrong");
        }
      }
    },
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    async resetPassword() {
      if (this.password.length > 6) {
        try {
          await HTTP.put("drivex/current-user/update-password", {
            password: this.password,
          });
          alert("Updated");
          this.password = "";
        } catch {
          alert("something went wrong");
        }
      }
    },
    async loadProfile() {
      const { data } = await HTTP.get("/drivex/current-user");
      this.profileData = data;
      this.pauseLeadAssignment = data.pauseLeadAssignment;
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
