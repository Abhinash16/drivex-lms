<template>
  <v-container fluid>
    <v-card outlined class="rounded-lg" :loading="loading">
      <!-- Header -->
      <v-card-title class="py-4 px-6 d-flex align-center">
        <v-icon left color="primary" class="mr-2">mdi-account-multiple</v-icon>
        <span class="text-h6">Agents ({{ agentsList.length }})</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          rounded
          large
          depressed
          dark
          @click="dialog = true"
        >
          <v-icon left>mdi-plus</v-icon> Add Agent
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Table -->
      <v-simple-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!agentsList.length && !loading">
            <td colspan="7" class="text-center py-4 grey--text">
              No agents found.
            </td>
          </tr>
          <tr v-for="(agent, index) in agentsList" :key="agent._id">
            <td>{{ index + 1 }}</td>
            <td>{{ agent.username }}</td>
            <td>{{ agent.name }}</td>
            <td>{{ agent.email }}</td>
            <td>{{ agent.mobile }}</td>
            <td>{{ agent.company }}</td>
            <td>
              <v-btn icon @click="navigateToAgentDetails(agent._id)">
                <v-icon color="primary">mdi-eye-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <!-- <v-divider /> -->

      <v-card-text class="text-center">
        <v-alert
          v-if="feedbackMessage"
          type="error"
          dense
          outlined
          class="mt-4"
        >
          {{ feedbackMessage }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Add Agent Dialog -->
    <v-dialog max-width="500" v-model="dialog">
      <v-card :loading="loading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Add Agent
            </span>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Form Fields -->
          <div class="pt-4">
            <v-form
              ref="agentForm"
              v-model="formValid"
              @submit.prevent="submitForm"
            >
              <v-text-field
                label="Username"
                v-model="agent.username"
                :rules="[(v) => !!v || 'Username is required']"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                label="Name"
                v-model="agent.name"
                :rules="[(v) => !!v || 'Name is required']"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                label="Email"
                v-model="agent.email"
                type="email"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Invalid email',
                ]"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                label="Mobile"
                v-model="agent.mobile"
                :rules="[(v) => !!v || 'Mobile is required']"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                label="Company"
                v-model="agent.company"
                :rules="[(v) => !!v || 'Company is required']"
                outlined
                dense
                class="mb-3"
              />
              <v-text-field
                label="Password"
                v-model="agent.password"
                type="password"
                :rules="[
                  (v) => !!v || 'Password required',
                  (v) => v.length >= 6 || 'Min 6 characters',
                ]"
                outlined
                dense
                class="mb-3"
              />
            </v-form>

            <v-alert
              v-if="errorMessage"
              type="error"
              dense
              class="mt-2"
              outlined
            >
              {{ errorMessage }}
            </v-alert>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn text rounded large class="mr-2" @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              rounded
              large
              depressed
              :disabled="!formValid"
              @click="submitForm"
            >
              <v-icon left>mdi-check</v-icon>
              Submit
            </v-btn>
          </div>
        </v-container>
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
      agentsList: [],
      feedbackMessage: null,
      loading: false,
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Mobile",
          value: "mobile",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Role",
          value: "role",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ],
      dialog: false,
      errorMessage: "",
      agent: {
        username: "harhit",
        company: "harshit",
        password: "harshit123",
        mobile: "768763474647",
        email: "harshit@gmail.com",
        name: "harshit",
      },
      formValid: "",
    };
  },
  components: {},
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("drivex/agents");
        console.log("🚀 ~ loadData ~ data:", data);
        if (data.status == 401) {
          this.feedbackMessage = data.message;
        } else {
          this.agentsList = data.items;
        }
      } catch (err) {
        this.feedbackMessage = err.response.data.message;
        console.log("error", err);
      } finally {
        this.loading = false;
      }
    },

    navigateToAgentDetails(agentId) {
      this.$router.push("/admin/agent/" + agentId);
    },

    async submitForm() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const { data } = await HTTP.post("/drivex/insert/agent", this.agent);
        console.log("🚀 ~ submitForm ~ data:", data);

        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Agent added successfully!",
          confirmButtonText: "OK",
        });

        this.dialog = false;
        this.resetForm();
        this.loadData();
      } catch (err) {
        // console.error(err);
        Swal.fire({
          icon: "error",
          text:
            err.response?.data?.error ||
            err.message ||
            "An unexpected error occurred while submitting the form.",
          title: "Failed",
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.agent = {
        username: "",
        company: "",
        password: "",
        mobile: "",
        email: "",
        name: "",
      };
    },
  },
};
</script>

<style></style>
