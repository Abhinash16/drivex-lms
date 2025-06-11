<template>
  <v-app>
    <v-app-bar app flat outlined>
      <v-app-bar-nav-icon @click="nav = !nav"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom transition="scale-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" class="d-flex align-center">
            <v-avatar size="32" class="mr-2">
              <v-icon color="primary">mdi-account-circle</v-icon>
            </v-avatar>
            <span class="font-weight-medium text-body-2 d-none d-sm-inline">
              {{ loggedInUser.username }}
            </span>
            <v-icon small class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card class="pa-2" min-width="210">
          <v-card-text class="pa-2 pb-0">
            <div class="text-subtitle-2 font-weight-medium">
              Logged in as <strong>{{ loggedInUser.username }}</strong>
            </div>
          </v-card-text>

          <v-divider class="my-2"></v-divider>

          <v-btn text block class="justify-start" to="/profile" router>
            <v-icon left>mdi-account</v-icon>
            Profile
          </v-btn>

          <v-btn text block class="justify-start" to="/settings" router>
            <v-icon left>mdi-cog</v-icon>
            Settings
          </v-btn>

          <v-divider class="my-2"></v-divider>

          <v-btn text block class="justify-start red--text" @click="logout">
            <v-icon left color="error">mdi-logout</v-icon>
            Logout
          </v-btn>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="nav" app>
      <template v-slot:append>
        <v-list nav dense rounded>
          <v-list-item link to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>

      <v-container>
        <div>SF <v-chip x-small color="info">BETA 1.0</v-chip></div>
      </v-container>

      <v-list nav dense rounded>
        <v-list-item color="primary" to="/search" link>
          <v-list-item-icon>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Search Application</v-list-item-title>
        </v-list-item>
        <v-list-item color="primary" to="/leads" link>
          <v-list-item-icon>
            <v-icon>mdi-chevron-double-right</v-icon>
          </v-list-item-icon>
          <v-list-item-title>All Leads </v-list-item-title>
        </v-list-item>
        <v-list-item color="primary" to="/pinned" link>
          <v-list-item-icon>
            <v-icon>mdi-pickaxe</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Pinned</v-list-item-title>
        </v-list-item>

        <v-subheader inset>Leads (Assigned)</v-subheader>

        <v-list-item
          color="primary"
          :to="`/leads-${data.urlSlug}`"
          link
          v-for="(data, index) in stagesFilters"
          :key="index"
        >
          <v-list-item-icon>
            <v-icon :color="getStatusColor(data.abbr)"
              >mdi-chevron-double-right</v-icon
            >
          </v-list-item-icon>
          <v-list-item-title
            style="font-weight: bold"
            :style="{ color: getStatusColor(data.abbr) }"
            >{{ data.abbr ? data.abbr : data._id }}
            <v-chip
              v-if="data.count > 0 && data.badgeType == 'notify'"
              dark
              :color="data.count > 20 ? 'error' : 'warning'"
              x-small
              >{{ data.count }}</v-chip
            >
            <span
              class="text--disabled"
              v-if="data.count > 0 && data.badgeType == 'silent'"
            >
              ({{ data.count }})
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app>
      <div class="mx-auto">© 2023 Ontrack | Sales Funnel</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      nav: false,
      isMobile: false,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box" },
      ],
    };
  },
  watch: {},
  computed: {
    loggedInUser() {
      return this.$store.getters.getLoggedInUser;
    },
    stagesFilters() {
      return this.$store.getters.getStagesFilters;
    },
  },
  async mounted() {
    await this.$store.dispatch("getLeadStagesList");
    if (window.innerWidth >= 768) {
      this.nav = true;
    }
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    async logout() {
      this.$store.dispatch("AUTH_LOGOUT").then(() => {
        this.$router.push("/login");
      });
    },
    handleWindowResize() {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
  },
};
</script>

<style scoped></style>
