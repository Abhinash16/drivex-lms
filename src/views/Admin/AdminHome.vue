<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="4" v-for="(stat, index) in stats" :key="index">
        <v-card class="rounded-lg pa-4" outlined>
          <div class="d-flex align-center">
            <v-avatar size="48" class="mr-4" color="primary">
              <v-icon dark>{{ stat.icon }}</v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h5 font-weight-bold mb-1">{{ stat.count }}</h2>
              <div class="text-subtitle-2 grey--text text--darken-1">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      stats: [
        { label: "Agents", count: 8, icon: "mdi-account-group" },
        { label: "Conversations", count: 17, icon: "mdi-forum" },
        { label: "Halt-Convos", count: 87, icon: "mdi-pause-circle" },
      ],
    };
  },
};
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.v-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
</style>
