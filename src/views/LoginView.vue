<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <v-card elevation="8" class="mx-auto" shaped>
          <!-- Header -->
          <v-card-title class="justify-center pt-8 pb-4">
            <div class="text-center">
              <v-avatar size="80" color="primary" class="mb-4">
                <v-icon size="40" color="white">mdi-account-circle</v-icon>
              </v-avatar>
              <h2 class="display-1 font-weight-light primary--text">
                Welcome Back
              </h2>
              <p class="subtitle-1 grey--text text--darken-1 mt-2">
                Please login to continue.
              </p>
            </div>
          </v-card-title>

          <!-- Form -->
          <v-card-text class="px-8 pb-8">
            <v-form
              ref="loginForm"
              v-model="isFormValid"
              @submit.prevent="login"
              lazy-validation
            >
              <!-- Username -->
              <v-text-field
                v-model="username"
                label="Username"
                prepend-inner-icon="mdi-account"
                outlined
                :rules="usernameRules"
                :disabled="loading"
                class="mb-2"
                color="primary"
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                outlined
                :rules="passwordRules"
                :disabled="loading"
                class="mb-4"
                color="primary"
              ></v-text-field>

              <!-- Login Button -->
              <v-btn
                type="submit"
                color="primary"
                block
                rounded
                large
                elevation="2"
                :loading="loading"
                :disabled="!isFormValid || loading"
                class="mb-4"
              >
                <v-icon left v-if="!loading">mdi-login</v-icon>
                {{ loading ? "Signing In..." : "Sign In" }}
              </v-btn>

              <!-- Error -->
              <v-alert
                v-if="error"
                type="error"
                dense
                outlined
                dismissible
                @input="error = ''"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <!-- Success -->
              <v-alert
                v-if="successMessage"
                type="success"
                dense
                outlined
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
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
      successMessage: "",
      loading: false,
      showPassword: false,
      isFormValid: false,
      usernameRules: [(v) => !!v || "Username is required"],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },

  methods: {
    async login() {
      const isValid = await this.$refs.loginForm.validate();
      if (!isValid) return;

      this.loading = true;
      this.error = "";
      this.successMessage = "";

      try {
        const response = await this.$store.dispatch("AUTH_CHECK", {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        console.log("Login successful! Token:", token);

        this.successMessage = "Login successful!";
        setTimeout(() => {
          const nextPage = this.$route.query.next || "/";
          this.$router.push(nextPage);
        }, 1000);
      } catch (err) {
        console.error("Error during login:", err);
        this.error = "Invalid username or password";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional: You can further enhance it with transition or animation styles */
</style>
