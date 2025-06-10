<template>
  <div>
    <v-container>
      <div class="text-h4">Welcome {{ currentUserLoggedIn.username }}</div>
      <div class="my-5">
        <v-row>
          <v-col cols="6">
            <v-card max-height="300" min-height="300">
              <v-container>
                <v-row>
                  <v-col class="my-auto" cols="4">
                    <div class="text-h5 text-truncate">Reminder</div>
                  </v-col>
                  <v-col class="my-auto text-right">
                    <v-btn small text> View All</v-btn>
                  </v-col>
                </v-row>
                <reminder-view />
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card max-height="300" min-height="300">
              <v-container>
                <v-row>
                  <v-col class="my-auto" cols="4">
                    <div class="text-h5 text-truncate">Pinned</div>
                  </v-col>
                  <v-col class="my-auto text-right">
                    <v-btn small text> View All</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card max-height="300" min-height="300">
              <v-container>
                <v-row>
                  <v-col class="my-auto" cols="4">
                    <div class="text-h5 text-truncate">Scheduled</div>
                  </v-col>
                  <v-col class="my-auto text-right">
                    <v-btn small text> View All</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    currentUserLoggedIn() {
      return this.$store.getters.getLoggedInUser;
    },
  },
};
</script>

<style></style>
