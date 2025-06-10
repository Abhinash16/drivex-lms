<template>
  <div>
    <v-container>
      <div>
        <v-btn class="my-4" color="primary" dark @click="dialog = true">
          Add Role
        </v-btn>

        <div><strong>Roles</strong></div>
        <v-divider class="my-4" />
        <div v-if="loading">loading...</div>
        <div v-else>
          <div class="my-10 error--text" v-if="feedbackMessage">
            {{ feedbackMessage }}
          </div>

          <v-data-table :headers="headers" :items="rolesList">
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="selectForEdit(item)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
            </template>
            <template v-slot:[`item.permissions`]="{ item }">
              {{ item.permissions.join(", ") }}
            </template>
          </v-data-table>
        </div>
      </div>
    </v-container>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Role</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="agentForm" @submit.prevent="submitForm">
            <v-text-field
              label="Role Name"
              v-model="role.role"
              required
            ></v-text-field>

            <v-select
              label="Select Permissions"
              v-model="role.permissions"
              multiple
              :items="availablePermissions"
            ></v-select>
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

    <v-dialog v-model="editRoleDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Role</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="agentForm" @submit.prevent="submitEditForm">
            <v-text-field
              label="Role Name"
              v-model="editRole.role"
              required
            ></v-text-field>

            <v-select
              label="Select Permissions"
              v-model="editRole.permissions"
              multiple
              :items="availablePermissions"
            ></v-select>
          </v-form>
          <v-alert v-if="errorMessage" type="error" dismissible class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editRoleDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="submitEditForm">
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
      availablePermissions: [
        "fetchAgentsList",
        "editAgent",
        "fetchAgent",
        "fetchRoles",
        "createAgent",
      ],
      rolesList: [],
      feedbackMessage: null,
      loading: false,
      headers: [
        { text: "Role Name", value: "role" },
        { text: "Permissions", value: "permissions" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialog: false,
      errorMessage: "",
      role: {
        role: "Admin",
        permissions: [],
      },
      editRoleDialog: false,
      editRole: {
        role: "Admin",
        permissions: [],
        _id: "",
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
        const { data } = await HTTP.get("drivex/roles");
        console.log("🚀 ~ loadData ~ data:", data);
        if (data.status == 401) {
          this.feedbackMessage = data.message;
        } else {
          this.rolesList = data;
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
        const { data } = await HTTP.post("/drivex/role/create", this.role);
        console.log("🚀 ~ submitForm ~ data:", data);
        // On success
        alert("Role added successfully");
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
    selectForEdit(role) {
      this.editRole.permissions = role.permissions;
      this.editRole.role = role.role;
      this.editRole._id = role._id;
      this.editRoleDialog = true;
    },
    async submitEditForm() {
      try {
        this.errorMessage = ""; // Clear any previous error
        // Submit the form
        const { data } = await HTTP.put("/drivex/role/update", this.editRole);
        console.log("🚀 ~ submitForm ~ data:", data);
        // On success
        alert("Role updated successfully");
        this.editRoleDialog = false;
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
      this.role = {
        role: "",
        permissions: [],
      };
      this.editRole = {
        role: "",
        permissions: [],
        _id: "",
      };
    },
  },
};
</script>

<style></style>
