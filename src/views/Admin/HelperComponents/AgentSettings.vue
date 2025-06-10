<template>
  <div>
    <v-container v-if="localAgent">
      <v-card>
        <v-container>
          <div>
            Status:
            <v-chip
              outlined
              :color="localAgent.status == 'active' ? 'green' : 'gray'"
              class="ml-2"
              >{{ this.localAgent.status }}</v-chip
            >
            <v-btn
              color="primary"
              text
              class="ml-2"
              @click="editDialog('status')"
              >Edit</v-btn
            >
          </div>
          <div>
            Role: {{ roleFormatted }}
            <v-btn color="primary" text class="ml-2" @click="editDialog('role')"
              >Edit</v-btn
            >
          </div>
        </v-container>
      </v-card>
    </v-container>
    <v-dialog v-model="dialog" width="40%" persistent>
      <v-card>
        <v-container>
          <!-- <v-text-field
            v-model="editingPropertyValue"
            outlined
            dense
            :label="propertyEditing"
          ></v-text-field> -->
          <div v-if="propertyEditing == 'Status'">
            {{ editingPropertyValue ? "Active" : "Inactive" }}
            <v-switch v-model="editingPropertyValue" inset></v-switch>
          </div>
          <v-select
            :items="roles"
            v-else
            solo
            v-model="editingPropertyValue"
            :item-text="'role'"
            :item-value="'role'"
          ></v-select>
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
      roles: [],
      localAgent: { ...this.agent },
    };
  },
  props: {
    agent: Object,
  },
  mounted() {
    // console.log("Local Agent ", this.localAgent);
    this.fetchRoles();
  },
  methods: {
    editDialog(property) {
      switch (property) {
        case "status":
          this.propertyEditing = "Status";
          this.editingPropertyValue =
            this.agent.status == "active" ? true : false;
          this.editingPropertyReference = this.editingPropertyValue;
          break;

        case "role":
          this.propertyEditing = "Role";
          this.editingPropertyValue = this.agent.role;
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
          case "Status":
            payload.status = this.editingPropertyValue ? "active" : "inactive";
            break;

          case "Role":
            payload.role = this.editingPropertyValue;
            break;
        }
        const { data } = await HTTP.post(
          "/drivex/edit/agent/" + this.localAgent._id,
          payload
        );
        this.localAgent = data;
        this.$emit("update-agent", this.localAgent);
        console.log("🚀 ~ saveChanges ~ data:", data);
      } catch (error) {
        console.log("🚀 ~ saveChanges ~ error:", error);
      } finally {
        this.dialog = false;
      }
    },
    async fetchRoles() {
      const { data } = await HTTP.get("/drivex/roles");
      this.roles = data;
      console.log(this.roles);
    },
  },
  computed: {
    roleFormatted() {
      return this.localAgent.role.toUpperCase();
    },
  },
};
</script>

<style scoped>
.v-dialog {
  width: 50%;
}
</style>
