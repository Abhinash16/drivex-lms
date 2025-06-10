<template>
  <div>
    <v-container v-if="agent">
      <div>
        <h3>{{ agent.name }}</h3>
        <p>{{ agent.agentId }}</p>
      </div>
      <v-tabs v-model="tab">
        <v-tab>INFO</v-tab>
        <v-tab>SETTINGS</v-tab>
        <v-tab>PERMISSIONS</v-tab>
      </v-tabs>

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
    </v-container>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import AgentInfo from "./HelperComponents/AgentInfo.vue";
import AgentPermissions from "./HelperComponents/AgentPermissions.vue";
import AgentSettings from "./HelperComponents/AgentSettings.vue";
export default {
  data() {
    return {
      tab: 0,
      agent: null,
    };
  },
  components: { AgentInfo, AgentPermissions, AgentSettings },
  async mounted() {
    HTTP.get("/drivex/agent/" + this.$route.params.agentId).then((resp) => {
      this.agent = resp.data;
    });
  },
  methods: {
    updateAgent(newAgent) {
      this.agent = newAgent;
    },
  },
};
</script>

<style scoped></style>
