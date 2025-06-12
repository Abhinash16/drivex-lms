<template>
  <div>
    <v-container>
      <p class="primary--text font-weight-medium mb-4">(VIEW ONLY)</p>

      <v-card outlined class="rounded-lg" :loading="loading">
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Title</th>
                <th class="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="permissions.length === 0">
                <td colspan="3" class="text-center text-grey py-6">
                  No data available
                </td>
              </tr>
              <tr
                v-for="permission in permissions"
                :key="permission.permissionId"
              >
                <td>{{ permission.permissionId }}</td>
                <td>{{ permission.title }}</td>
                <td>{{ permission.description }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";

export default {
  data() {
    return {
      loading: false,
      permissions: [],
    };
  },
  props: {
    agent: Object,
  },
  async mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      this.loading = true;
      try {
        const { data } = await HTTP.get("/drivex/permissions/", {
          params: { role: this.agent.role },
        });
        this.permissions = data;
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
