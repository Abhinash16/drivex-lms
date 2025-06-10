<template>
  <div>
    <v-card
      min-height="90vh"
      v-if="loading"
      flat
      class="py-15 mt-15 text-center"
    >
      <v-progress-circular indeterminate></v-progress-circular>
      <div class="text-h6">Loading....</div>
    </v-card>
    <v-card min-height="90vh" v-else>
      <v-container>
        <div v-if="contacts.length > 0">
          <v-row>
            <v-col class="my-2" cols="4">
              <div class="text-heading my-auto text-truncate">
                {{ contacts.length }} item<span v-if="contacts.length > 1"
                  >s</span
                >
                found
              </div>
            </v-col>
            <v-col class="text-right" cols="8">
              <v-btn
                small
                class="my-auto"
                text
                @click="addNewContactDialog = true"
                color="primary"
                depressed
                large
              >
                <v-icon>mdi-plus</v-icon>
                Add <span class="hidden-md-and-down ml-1">contact</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-list>
            <v-list-item-group v-if="contacts.length">
              <v-list-item v-for="contact in contacts" :key="contact._id">
                <v-list-item-avatar>
                  <v-avatar color="primary">
                    <span class="white--text text-h5 text-uppercase">{{
                      contact.tsmName.substring(0, 2)
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content @click="viewContactFn(contact)">
                  <v-list-item-title>
                    {{ contact.tsmName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    +91 {{ contact.mobile }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-list-item-title @click="startEditingContact(contact)"
                          >Edit Contact</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title
                          class="error--text"
                          @click="deleteContact(contact._id)"
                          >Delete Permanently</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
        <v-card flat fill-height v-else class="py-15 mt-15 text-center">
          <div class="text-h3">No contacts added yet</div>
          <v-btn
            small
            class="mt-5"
            text
            @click="addNewContactDialog = true"
            color="primary"
            depressed
            large
          >
            Add new contact
          </v-btn>
        </v-card>
      </v-container>
    </v-card>

    <v-dialog
      max-width="600"
      max-height="600"
      centered
      v-model="editContactDialog"
      :persistent="!areObjectsEqual(currentEditContact, tempEditedContact)"
    >
      <div v-if="tempEditedContact">
        <v-card>
          <v-container>
            <div class="text-right my-4">
              <v-btn @click="editContactDialogClose" icon>
                <v-icon>mdi-close</v-icon></v-btn
              >
            </div>

            <v-form ref="editContact">
              <v-text-field
                outlined
                v-model="tempEditedContact.tsmName"
                label="New Name"
              ></v-text-field>
              <v-text-field
                outlined
                prefix="+91"
                v-model="tempEditedContact.mobile"
                label="New Mobile"
              ></v-text-field>
              <v-chip
                @click="addmorelocationEditedContact = true"
                color="success"
                class="my-4"
                >+ Add location</v-chip
              >

              <div style="max-height: 120px; overflow: scroll">
                <v-chip-group column>
                  <v-chip
                    v-for="(data, i) in tempEditedContact.location"
                    :key="i"
                    close
                    @click:close="deleteLocation(i, 'newContact')"
                    >{{ data }}</v-chip
                  >
                </v-chip-group>
              </div>

              <v-btn
                class="my-5"
                @click="editContact(true)"
                large
                depressed
                block
                color="primary"
                >Update</v-btn
              >
            </v-form>
          </v-container>
        </v-card>
      </div>
    </v-dialog>

    <v-dialog
      overlay-opacity="0.9"
      max-width="500"
      v-model="addmorelocationEditedContact"
    >
      <v-card v-if="tempEditedContact">
        <v-container>
          <v-autocomplete
            v-model="tempEditedContact.location"
            :items="locations"
            label="Search Location"
            :search-input.sync="searchValueFromAPI"
            :item-text="locationDropDownField"
            :rules="locationRules"
            validate-on-blur
            multiple
            chips
            small-chips
            autofocus
            placeholder="start writing state, city or pincode"
          >
          </v-autocomplete>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- add new contact -->
    <v-dialog max-width="600" centered v-model="addNewContactDialog">
      <v-card>
        <v-container v-if="newContact">
          <v-form ref="addNewContact">
            <v-text-field
              outlined
              v-model="newContact.tsmName"
              label="Name"
              :rules="nameRules"
              validate-on-blur
              autofocus
            ></v-text-field>
            <v-text-field
              outlined
              prefix="+91"
              v-model="newContact.mobile"
              label="Mobile"
              :rules="mobileRules"
              validate-on-blur
            ></v-text-field>

            <div style="max-height: 120px; overflow: scroll">
              <v-chip-group column>
                <v-chip
                  v-for="(data, i) in newContact.location"
                  :key="i"
                  close
                  @click:close="deleteLocation(i, 'newContact')"
                  >{{ data }}</v-chip
                >
              </v-chip-group>
            </div>
            <div class="my-4">
              <v-chip @click="addmorelocationNewContact = true" color="success"
                >+ Add location</v-chip
              >
            </div>
            <v-btn
              @click="addNewContactFn"
              large
              depressed
              block
              color="primary"
              >Add Contact</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      overlay-opacity="0.9"
      max-width="500"
      v-model="addmorelocationNewContact"
    >
      <v-card v-if="newContact">
        <v-container>
          <v-autocomplete
            v-model="newContact.location"
            :items="locations"
            label="Search Location"
            :search-input.sync="searchValueFromAPI"
            :item-text="locationDropDownField"
            :rules="locationRules"
            validate-on-blur
            multiple
            chips
            small-chips
            autofocus
            placeholder="start writing state, city or pincode"
          >
          </v-autocomplete>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog max-width="500" v-model="saveBeforeExit">
      <v-card>
        <v-container class="pa-6">
          <div>
            You have unsaved changes, do you want to save them before closing?
          </div>
          <v-divider class="my-5"></v-divider>

          <div class="mt-5 text-right">
            <v-btn color="error" small @click="closeSave" text
              >Close anyway</v-btn
            >
            <v-btn
              rounded
              small
              depressed
              @click="editContact"
              color="primary"
              class="ml-2"
              >Save Changes</v-btn
            >
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog max-width="600" centered v-model="viewContactDialog">
      <v-card>
        <v-container v-if="selectedContact">
          <v-row>
            <v-col class="my-auto" cols="10">
              <div class="text-h4 text-truncate">
                {{ selectedContact.tsmName }}
              </div>
              <div class="">{{ selectedContact.mobile }}</div>
            </v-col>
            <v-col class="my-auto text-right" cols="2">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="my-auto" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title
                      @click="startEditingContact(selectedContact)"
                      >Edit Contact</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      class="error--text"
                      @click="deleteContact(selectedContact._id)"
                      >Delete Permanently</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <div
            style="max-height: 250px; overflow: scroll"
            v-if="selectedContact"
          >
            <v-chip-group column>
              <v-chip
                v-for="(data, i) in selectedContact.location"
                :key="i"
                close
                >{{ data }}</v-chip
              >
            </v-chip-group>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import _ from "lodash";

export default {
  props: ["contacts"],
  data() {
    return {
      loading: false,

      addmorelocationNewContact: false,
      addmorelocationEditedContact: false,
      addNewContactDialog: false,
      editContactDialog: false,
      editingContact: null,
      searchValueFromAPI: null,

      // refined
      tempEditedContact: {
        tsmName: "",
        mobile: "",
        location: [],
      },
      currentEditContact: {
        tsmName: "",
        mobile: "",
        location: [],
      },
      saveBeforeExit: false,
      selectedContact: null,
      viewContactDialog: false,

      // up here
      newContact: {
        tsmName: "",
        mobile: "",
        selectedLocation: [],
        location: [],
        message: "Save",
      },
      nameRules: [
        (v) => !!v || "Name is required.",
        (v) =>
          (v && /^[a-zA-Z\s]+$/.test(v)) ||
          "Name should only contain letters and spaces.",
      ],
      mobileRules: [
        (v) => !!v || "Mobile Number is required.",
        (v) => (v && /^[6-9]\d{9}$/.test(v)) || "Enter a valid mobile number.",
      ],
      locationRules: [(v) => !!v || "Location is required."],
      locations: [],
    };
  },
  watch: {
    searchValueFromAPI: _.debounce(function (newValue) {
      if (newValue && newValue.length > 2) {
        HTTP.get("/finance/list/state-city", {
          params: {
            searchParams: newValue,
          },
        })
          .then((resp) => {
            this.locations = resp.data;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, 500), // Adjust the debounce delay as needed (in milliseconds)
  },
  methods: {
    viewContactFn(contact) {
      this.selectedContact = contact;
      this.viewContactDialog = true;
    },
    editContactDialogClose() {
      if (
        this.areObjectsEqual(this.currentEditContact, this.tempEditedContact)
      ) {
        this.editContactDialog = false;
      } else {
        this.saveBeforeExit = true;
      }
    },
    closeSave() {
      this.saveBeforeExit = false;
      this.editContactDialog = false;
    },
    deleteLocation(index, contact) {
      switch (contact) {
        case "newContact":
          this.newContact.location.splice(index, 1);
          break;

        case "editedContact":
          this.tempEditedContact.location.splice(index, 1);
          break;
      }
    },
    locationDropDownField(item) {
      return `${item.city_name} - ${item.state_name} (${item.pincode})`;
    },
    async deleteContact(id) {
      console.log("🚀 ~ deleteContact ~ id:", id);
      if (confirm("Are you sure, this process cannot be reversed.")) {
        try {
          await HTTP.delete(`/idfc/contacts/${id}`);
          // After successful deletion, you may want to refresh the contacts
          this.$emit("contacts-updated");
          this.$toast.open({
            message: "Contact Deleted",
            position: "top",
            type: "success",
          });
          // Fetch contacts from your backend API using Axios and update the contacts array
        } catch (error) {
          console.error("Error deleting contact:", error.message);
        }
      }
    },
    startEditingContact(contact) {
      this.currentEditContact = { ...contact };
      this.tempEditedContact = { ...contact };

      this.editContactDialog = true;
    },
    async editContact(closeAsWell = false) {
      if (this.$refs.editContact.validate()) {
        this.loading = true;
        const id = this.tempEditedContact._id;
        try {
          await HTTP.put(`idfc/contacts/${id}`, this.tempEditedContact);
          this.tempEditedContact = {
            tsmName: "",
            mobile: "",
            location: [],
          };
          this.$emit("contacts-updated");
          this.$toast.open({
            message: "Contact Edited",
            position: "top",
            type: "error",
          });
          this.loading = false;
          this.saveBeforeExit = false;
          if (closeAsWell) {
            this.editContactDialog = false;
          }
        } catch (error) {
          this.loading = false;
          console.error("Error updating contact:", error.message);
        }
      }
    },
    async addNewContactFn() {
      if (this.$refs.addNewContact.validate()) {
        this.loading = true;
        try {
          if (this.newContact.location.length > 0) {
            await HTTP.post("idfc/contacts", this.newContact);
            this.$emit("contacts-updated");
            this.loading = false;
            this.addNewContactDialog = false;
            // After successful addition, you may want to refresh the contacts
            // Fetch contacts from your backend API using Axios and update the contacts array
            this.newContact = {
              tsmName: "",
              mobile: "",
              location: [],
            };
          } else {
            this.$toast.open({
              message: "Please select atleast one location",
              position: "top",
              type: "error",
            });
            this.addmorelocationNewContact = true;
          }
        } catch (error) {
          this.loading = false;
          console.error("Error adding contact:", error.message);
        }
      }
    },
    areObjectsEqual(obj1, obj2) {
      // Get the keys of the objects
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // Check if the number of keys is the same
      if (keys1.length !== keys2.length) {
        return false;
      }

      // Iterate through the keys and compare values
      for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }

      // Objects are equal
      return true;
    },
  },
};
</script>

<style scoped>
/* Add your styling here */
.pulsate {
  animation: pulsate 1s ease-in-out infinite;
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
