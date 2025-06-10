<template>
  <div>
    <v-container>
      <p style="color: #1976d2">(VIEW ONLY)</p>
      <v-data-table :headers="headers" :items="permissions"></v-data-table>
    </v-container>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data() {
    return {
      headers: [
        {
          text: "ID",
          value: "permissionId",
          sortable: false,
        },
        {
          text: "Title",
          value: "title",
          sortable: false,
        },
        {
          text: "Description",
          value: "description",
          sortable: false,
        },
      ],
      permissions: [],
    };
  },
  async mounted() {
    this.fetchPermissions();
  },
  components: {},
  props: {
    agent: Object,
  },
  methods: {
    async fetchPermissions() {
      let role = this.agent.role;
      const { data } = await HTTP.get("/drivex/permissions/", {
        params: {
          role,
        },
      });
      this.permissions = data;
    },
  },
};
</script>
