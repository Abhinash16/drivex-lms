<template>
  <v-container fluid>
    <v-card v-if="agent" outlined class="pa-4 rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h6 font-weight-bold">{{ agent.name }}</div>
          <div class="text-subtitle-2 grey--text">
            Agent ID: {{ agent.agentId }}
          </div>
        </div>
      </v-card-title>

      <v-divider class="my-4"></v-divider>

      <!-- Tabs -->
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab>Info</v-tab>
        <v-tab>Settings</v-tab>
        <v-tab>Permissions</v-tab>
      </v-tabs>

      <v-divider class="mb-4"></v-divider>

      <!-- Tab Content -->
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <AgentInfo :agent="agent" @update-agent="updateAgent" />
        </v-tab-item>
        <v-tab-item>
          <AgentSettings :agent="agent" @update-agent="updateAgent" />
        </v-tab-item>
        <v-tab-item>
          <AgentPermissions :agent="agent" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- Loading State -->
    <v-container v-else class="py-15 text-center">
      <v-progress-circular color="primary" indeterminate size="64">
      </v-progress-circular>
      <div class="mt-4 text-subtitle-1">Loading agent information...</div>
    </v-container>

    <!-- Error -->
    <div v-if="errorMessage" class="error--text text-center mt-4">
      {{ errorMessage }}
    </div>
  </v-container>
</template>

<script>
import { HTTP } from "@/services/axios";
import AgentInfo from "./HelperComponents/AgentInfo.vue";
import AgentPermissions from "./HelperComponents/AgentPermissions.vue";
import AgentSettings from "./HelperComponents/AgentSettings.vue";

export default {
  components: { AgentInfo, AgentPermissions, AgentSettings },
  data() {
    return {
      tab: 0,
      agent: null,
      errorMessage: "",
    };
  },

  async mounted() {
    try {
      const { data } = await HTTP.get(
        "/drivex/agent/" + this.$route.params.agentId
      );
      this.agent = data;
    } catch (err) {
      console.error("Failed to load agent details:", err);
      this.errorMessage =
        err.response?.data?.error ||
        "Unable to fetch agent data. Please try again later.";
    }
  },

  methods: {
    updateAgent(newAgent) {
      this.agent = newAgent;
    },
  },
};
</script>

<style scoped></style>
