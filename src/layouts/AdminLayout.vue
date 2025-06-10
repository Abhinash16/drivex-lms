<template>
  <div>
    <v-app-bar app flat outlined>
      <v-app-bar-nav-icon @click="nav = !nav"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout()" icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="nav" app>
      <!-- <template v-slot:append>
        <v-list nav dense rounded>
          <v-list-item link to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>
      </template> -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Loan - Admin <v-chip x-small color="warning">BETA 1.0</v-chip>
          </v-list-item-title>
          <v-list-item-subtitle> 1.0.0 </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list nav dense rounded>
        <v-list-item exact color="warning" to="/admin" link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Homepage</v-list-item-title>
        </v-list-item>
        <v-list-item exact color="warning" to="/admin/agents" link>
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Manage Agents</v-list-item-title>
        </v-list-item>
        <v-list-item exact color="warning" to="/admin/roles" link>
          <v-list-item-icon>
            <v-icon>mdi-account-lock-open-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Manage Roles</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app>
      <div class="mx-auto">© 2023 Ontrack | Sales Funnel</div>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: true,
    };
  },
};
</script>

<style></style>
