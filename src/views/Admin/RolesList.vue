<template>
  <v-container fluid>
    <v-card outlined class="rounded-lg" :loading="loading">
      <!-- Header -->
      <v-card-title class="py-4 px-6 d-flex align-center">
        <v-icon left color="primary" class="mr-2">mdi-shield-account</v-icon>
        <span class="text-h6">Roles ({{ rolesList.length }})</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          rounded
          large
          depressed
          dark
          @click="dialog = true"
        >
          <v-icon left>mdi-plus</v-icon> Add Role
        </v-btn>
      </v-card-title>

      <v-divider />

      <!-- Table -->
      <v-simple-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rolesList.length && !loading">
            <td colspan="4" class="text-center py-4 grey--text">
              No roles found.
            </td>
          </tr>
          <tr v-for="(role, index) in rolesList" :key="role._id">
            <td>{{ index + 1 }}</td>
            <td>{{ role.role || "N/A" }}</td>
            <td>{{ role.permissions.join(", ") || "N/A" }}</td>
            <td>
              <v-btn icon @click="selectForEdit(role)">
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

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

    <!-- Add Role Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card :loading="loading">
        <v-container class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text"
              >Add Role</span
            >
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="pt-4">
            <v-form ref="roleForm" @submit.prevent="submitForm">
              <v-text-field
                label="Role Name"
                v-model="role.role"
                outlined
                dense
                :rules="[(v) => !!v || 'Role name is required']"
                class="mb-3"
              />
              <v-select
                label="Select Permissions"
                v-model="role.permissions"
                :items="availablePermissions"
                multiple
                outlined
                dense
                class="mb-3"
              />
            </v-form>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn text rounded large class="mr-2" @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" rounded large depressed @click="submitForm">
              <v-icon left>mdi-check</v-icon> Submit
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Edit Role Dialog -->
    <v-dialog v-model="editRoleDialog" max-width="500">
      <v-card :loading="loading">
        <v-container class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text"
              >Edit Role</span
            >
            <v-btn icon @click="editRoleDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="pt-4">
            <v-form ref="editRoleForm" @submit.prevent="submitEditForm">
              <v-text-field
                label="Role Name"
                v-model="editRole.role"
                outlined
                dense
                :rules="[(v) => !!v || 'Role name is required']"
                class="mb-3"
              />
              <v-select
                label="Select Permissions"
                v-model="editRole.permissions"
                :items="availablePermissions"
                multiple
                outlined
                dense
                class="mb-3"
              />
            </v-form>
          </div>

          <div class="d-flex justify-end mt-4">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="editRoleDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              rounded
              large
              depressed
              @click="submitEditForm"
            >
              <v-icon left>mdi-check</v-icon> Submit
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
      this.loading = true;
      try {
        // Submit the form
        const { data } = await HTTP.post("/drivex/role/create", this.role);
        console.log("🚀 ~ submitForm ~ data:", data);

        this.dialog = false;
        this.loadData();
        this.resetForm();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Role added successfully",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.error(err);

        Swal.fire({
          icon: "error",
          text:
            err.response?.data?.error ||
            err.message ||
            "An unexpected error occurred while submitting the form.",
          title: "Failed",
          confirmButtonText: "OK",
        });
      }
    },

    selectForEdit(role) {
      this.editRole.permissions = role.permissions;
      this.editRole.role = role.role;
      this.editRole._id = role._id;
      this.editRoleDialog = true;
    },

    async submitEditForm() {
      this.loading = true;
      try {
        // Submit the form
        const { data } = await HTTP.put("/drivex/role/update", this.editRole);

        console.log("🚀 ~ submitForm ~ data:", data);

        this.editRoleDialog = false;
        this.loadData();
        this.resetForm();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Role updated successfully",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.error(err);
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
