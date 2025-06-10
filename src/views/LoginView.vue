<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                required
                :rules="[(v) => !!v || 'Username is required']"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :rules="[(v) => !!v || 'Password is required']"
              ></v-text-field>

              <v-btn type="submit" color="primary">Login</v-btn>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <p v-if="error" class="red--text">{{ error }}</p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },

  methods: {
    async login() {
      try {
        await this.$refs.loginForm.validate();
        const response = await this.$store.dispatch("AUTH_CHECK", {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        // Store the token in localStorage or Vuex for future requests
        // Redirect to another page or perform additional actions as needed
        console.log("Login successful! Token:", token);

        // Check if there's a 'next' query parameter in the URL
        const nextPage = this.$route.query.next;
        if (nextPage) {
          // If 'next' parameter exists, redirect to it
          this.$router.push(nextPage);
        } else {
          // If 'next' parameter doesn't exist, redirect to '/'
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.error = "Invalid username or password";
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
