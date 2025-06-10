<template>
  <div>
    <v-container>
      <div v-if="localAgent">
        <v-card>
          <v-container>
            <div>
              Name: {{ this.localAgent.name }}
              <v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('name')"
                >Edit</v-btn
              >
            </div>
            <div>
              Email:
              <strong
                ><a href="">{{ this.localAgent.email }}</a>
                <v-btn
                  color="primary"
                  text
                  class="ml-2"
                  small
                  @click="editDialog('email')"
                  >Edit</v-btn
                ></strong
              >
            </div>
            <div>
              Mobile:
              <strong
                ><a href="">{{ this.localAgent.mobile }}</a></strong
              ><v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('mobile')"
                >Edit</v-btn
              >
            </div>
            <div>
              Access Level: {{ this.localAgent.accessLevel }}
              <v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('accessLevel')"
                >Edit</v-btn
              >
            </div>
            <!-- <div>
              Role: {{ agent.role }}
              <v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('role')"
                >Edit</v-btn
              >
            </div> -->
            <div>
              Username: {{ this.localAgent.username }}
              <v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('username')"
                >Edit</v-btn
              >
            </div>
            <div>
              Password: *************
              <v-btn
                color="primary"
                text
                class="ml-2"
                small
                @click="editDialog('password')"
                >Edit</v-btn
              >
            </div>
          </v-container>
        </v-card>
      </div>
    </v-container>
    <v-dialog v-model="dialog" width="40%" persistent>
      <v-card>
        <v-container>
          <v-text-field
            v-model="editingPropertyValue"
            outlined
            dense
            :label="propertyEditing"
          ></v-text-field>
          <div class="d-flex justify-end">
            <v-btn class="mr-2" @click="cancel()">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="saveChanges()"
              :disabled="editingPropertyReference == editingPropertyValue"
              >Save changes</v-btn
            >
          </div>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="propertyChanged" width="30%">
      <v-card>
        <v-container>
          <h4>Unsaved changes would be lost</h4>
          <p>- Click cancel and save changes.</p>
          <div class="d-flex justify-end">
            <v-btn class="mr-2" small @click="propertyChanged = false"
              >Cancel</v-btn
            >
            <v-btn color="primary" small @click="continueWithoutSaving"
              >OK</v-btn
            >
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
export default {
  data() {
    return {
      dialog: false,
      propertyEditing: null,
      editingPropertyValue: null,
      editingPropertyReference: null,
      propertyChanged: false,
      localAgent: { ...this.agent },
    };
  },
  props: {
    agent: Object,
  },
  mounted() {},
  methods: {
    editDialog(property) {
      switch (property) {
        case "email":
          this.propertyEditing = "Email";
          this.editingPropertyValue = this.localAgent.email;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "mobile":
          this.propertyEditing = "Mobile";
          this.editingPropertyValue = this.localAgent.mobile;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "name":
          this.propertyEditing = "Name";
          this.editingPropertyValue = this.localAgent.name;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "username":
          this.propertyEditing = "Username";
          this.editingPropertyValue = this.localAgent.username;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "password":
          this.propertyEditing = "Password";
          this.editingPropertyValue = null;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "accessLevel":
          this.propertyEditing = "Access Level";
          this.editingPropertyValue = this.localAgent.accessLevel;
          this.editingPropertyReference = this.editingPropertyValue;
          break;
      }
      this.dialog = true;
    },
    cancel() {
      if (this.editingPropertyReference != this.editingPropertyValue)
        this.propertyChanged = true;
      else this.dialog = false;
    },
    continueWithoutSaving() {
      this.propertyChanged = false;
      this.dialog = false;
    },
    async saveChanges() {
      try {
        let payload = {};
        switch (this.propertyEditing) {
          case "Email":
            payload.email = this.editingPropertyValue;
            break;

          case "Mobile":
            payload.mobile = this.editingPropertyValue;
            break;

          case "Username":
            payload.username = this.editingPropertyValue;
            break;

          case "Name":
            payload.name = this.editingPropertyValue;
            break;

          case "Password":
            payload.password = this.editingPropertyValue;
            break;

          case "Access Level":
            payload.accessLevel = this.editingPropertyValue;
            break;
        }
        const { data } = await HTTP.post(
          "/drivex/edit/agent/" + this.agent._id,
          payload
        );
        console.log("🚀 ~ saveChanges ~ data:", data);
        this.localAgent = data;
        this.$emit("update-agent", this.localAgent);
        console.log("🚀 ~ saveChanges ~ data:", data);
      } catch (error) {
        console.log("🚀 ~ saveChanges ~ error:", error);
      } finally {
        this.dialog = false;
      }
    },
  },
};
</script>

<style scoped>
.v-dialog {
  width: 50%;
}
</style>
