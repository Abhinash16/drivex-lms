<template>
  <div>
    <v-container>
      <div>
        <v-btn class="my-4" color="primary" dark @click="dialog = true">
          Add Agent
        </v-btn>

        <div><strong>Agents</strong></div>
        <v-divider class="my-4" />
        <div v-if="loading">loading...</div>
        <div v-else>
          <div class="my-10 error--text" v-if="feedbackMessage">
            {{ feedbackMessage }}
          </div>

          <v-data-table :headers="headers" :items="agentsList">
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="navigateToAgentDetails(item._id)"
                ><v-icon>mdi-eye-outline</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </div>
      </div>
    </v-container>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Agent</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="agentForm" @submit.prevent="submitForm">
            <v-text-field
              label="Username"
              v-model="agent.username"
              required
            ></v-text-field>

            <v-text-field
              label="Company"
              v-model="agent.company"
              required
            ></v-text-field>

            <v-text-field
              label="Password"
              v-model="agent.password"
              type="password"
              required
              :rules="[(v) => v.length >= 6 || 'Minimum 6 characters']"
            ></v-text-field>

            <v-text-field
              label="Mobile"
              v-model="agent.mobile"
              required
            ></v-text-field>

            <v-text-field
              label="Email"
              v-model="agent.email"
              type="email"
              required
            ></v-text-field>

            <v-text-field
              label="Name"
              v-model="agent.name"
              required
            ></v-text-field>
          </v-form>
          <v-alert v-if="errorMessage" type="error" dismissible class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="submitForm">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
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
      try {
        this.errorMessage = ""; // Clear any previous error

        // Submit the form
        const { data } = await HTTP.post("/drivex/insert/agent", this.agent);
        console.log("🚀 ~ submitForm ~ data:", data);
        // On success
        alert("Agent added successfully");
        this.dialog = false;
        this.loadData();
        this.resetForm();
      } catch (err) {
        console.error(err);

        // Try to extract meaningful backend error
        this.errorMessage =
          err.response?.data?.error ||
          err.message ||
          "An unexpected error occurred while submitting the form.";
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
