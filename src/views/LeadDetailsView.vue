<template>
  <div>
    <!-- Loading State -->
    <v-container class="py-15 text-center" v-if="loading && !ticketData">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
      <div class="mt-4 text-subtitle-1">Loading ticket information...</div>
    </v-container>

    <!-- Main Content -->
    <v-container v-else-if="ticketData" class="pa-0 pa-sm-2">
      <v-card class="elevation-1">
        <v-row no-gutters>
          <!-- Left Column - Customer Details & Timeline -->
          <v-col cols="12" md="7" class="border-md-right">
            <!-- Customer Info Card -->
            <v-card flat class="pa-4">
              <!-- Status Chip -->
              <div class="d-flex align-center mb-2">
                <v-chip
                  :color="getStatusColor(ticketData.currentStage)"
                  text-color="white"
                  class="font-weight-medium"
                >
                  {{ ticketData.currentStage }}
                </v-chip>

                <v-spacer></v-spacer>

                <!-- Pin/Unpin Button -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      :color="ticketData.pinned ? 'error' : 'success'"
                      @click="changePinnedStatus(!ticketData.pinned)"
                    >
                      <v-icon>{{
                        ticketData.pinned ? "mdi-pin-off" : "mdi-pin"
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span
                    >{{ ticketData.pinned ? "Unpin" : "Pin" }} this ticket</span
                  >
                </v-tooltip>
              </div>

              <!-- Rescheduled Alert -->
              <v-alert
                v-if="ticketData.currentStage === 'Rescheduled'"
                dense
                text
                color="orange"
                class="mb-4"
                border="left"
              >
                <div class="d-flex align-center">
                  <v-icon left>mdi-calendar-clock</v-icon>
                  <div>
                    <div
                      :class="
                        checkOverdueColor(ticketData.rescheduleDate) +
                        '--text' +
                        ' font-weight-bold'
                      "
                    >
                      {{ checkOverdue(ticketData.rescheduleDate) }}
                    </div>
                    <div>
                      Scheduled for:
                      {{ ticketData.rescheduleDate | moment("lll") }}
                    </div>
                  </div>
                </div>
              </v-alert>

              <!-- Customer Details -->
              <h2 class="text-h4 font-weight-bold mb-1">
                {{ ticketData.customer_name }}
              </h2>

              <!-- Phone -->
              <div class="d-flex align-center py-1">
                <v-icon class="mr-2">mdi-phone</v-icon>
                <div>
                  <a
                    :href="`tel:${ticketData.customer_mobile}`"
                    class="text-decoration-none"
                  >
                    {{ ticketData.customer_mobile }}
                  </a>
                </div>
              </div>

              <!-- Bike Model -->
              <div class="d-flex align-center py-1">
                <v-icon class="mr-2">mdi-motorbike</v-icon>
                <div>{{ ticketData.model }}</div>
              </div>

              <!-- Registration Number -->
              <div class="d-flex align-center py-1">
                <v-icon class="mr-2">mdi-card-account-details-outline</v-icon>
                <div>{{ ticketData.registration_number }}</div>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Call Status -->
              <div class="d-flex align-center">
                <div class="text-subtitle-1 font-weight-medium mr-2">
                  Call Status:
                </div>

                <v-chip
                  :color="getCallStatusColor(ticketData.callStatus)"
                  text-color="white"
                  small
                  class="mr-2"
                >
                  {{ ticketData.callStatus }}

                  <v-btn
                    icon
                    x-small
                    color="white"
                    class="ml-2"
                    @click="updateCallStatusModal = true"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-chip>
              </div>

              <!-- Quick Action Buttons -->
              <div class="pa-0 mt-4">
                <v-btn
                  v-if="
                    ticketData.currentStage == 'Fresh Lead' ||
                    ticketData.currentStage == 'Rescheduled' ||
                    ticketData.currentStage == 'Contacted'
                  "
                  color="primary"
                  text
                  rounded
                  depressed
                  large
                  @click="scheduleLeadDialog = true"
                >
                  <v-icon left>mdi-clock-time-five-outline</v-icon>
                  Schedule for Later
                </v-btn>
                <v-btn
                  color="error"
                  text
                  rounded
                  depressed
                  large
                  @click="closeTicketDialog = true"
                >
                  <v-icon left>mdi-close-circle-outline</v-icon>
                  Close Lead
                </v-btn>
              </div>
            </v-card>

            <v-divider></v-divider>

            <!-- Timeline Section -->
            <v-card flat class="pa-4" style="height: 600px">
              <h2 class="text-h6 font-weight-bold mb-4">Activity Timeline</h2>

              <!-- Vertical Scroll Wrapper -->
              <div style="height: calc(100% - 48px); overflow-y: auto">
                <v-timeline align-top dense class="pb-0">
                  <v-timeline-item
                    v-for="(data, index) in ticketComments"
                    :key="index"
                    :icon="getIcon(data.type)"
                    :color="
                      data.movedToStage
                        ? getStatusColor(data.movedToStage)
                        : 'grey'
                    "
                    small
                  >
                    <v-card
                      outlined
                      class="pa-3 mb-3"
                      :style="{
                        borderColor: $vuetify.theme.themes.light.primary,
                      }"
                    >
                      <div class="d-flex align-center mb-1">
                        <strong class="text-subtitle-1">
                          {{ data.agent ? data.agent.username : "System" }}
                          <span
                            v-if="data.agent"
                            class="text-caption grey--text"
                          >
                            ({{ data.agent.company }})
                          </span>
                        </strong>
                        <v-spacer></v-spacer>
                        <v-chip
                          v-if="data.movedToStage"
                          :color="getStatusColor(data.movedToStage)"
                          text-color="white"
                          small
                          class="ml-2"
                        >
                          {{ data.movedToStage }}
                        </v-chip>
                      </div>

                      <div class="text-body-2">{{ data.comment }}</div>

                      <div class="text-caption grey--text mt-2">
                        {{ data.createdAt | moment("ll") }} at
                        {{ data.createdAt | moment("h:mm a") }}
                      </div>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </div>
            </v-card>

            <!-- Comment Input -->
            <v-card flat class="pa-4">
              <v-textarea
                v-model="comment"
                outlined
                label="Add comment"
                placeholder="Enter your comment here..."
                rows="3"
                hide-details
                class="mb-2"
              ></v-textarea>
              <div class="text-right">
                <v-btn
                  :disabled="!comment"
                  color="success"
                  @click="addComment"
                  class="px-6"
                  rounded
                  depressed
                  large
                >
                  <v-icon left>mdi-comment-plus-outline</v-icon>
                  Add Comment
                </v-btn>
              </div>
            </v-card>
          </v-col>

          <!-- Right Column - Actions -->
          <v-col cols="12" md="5">
            <v-card flat class="pa-4 fixed-top">
              <!-- Assignment Info -->
              <v-card
                v-if="currentUserLoggedIn"
                :color="
                  ticketData.assignedTo &&
                  currentUserLoggedIn.username &&
                  ticketData.assignedTo === currentUserLoggedIn.username
                    ? 'success lighten-5'
                    : ticketData.assignedTo
                    ? 'red lighten-5'
                    : 'warning lighten-5'
                "
                outlined
                class="mb-4 pa-3"
              >
                <div class="d-flex align-center">
                  <v-icon
                    :color="
                      ticketData.assignedTo &&
                      currentUserLoggedIn.username &&
                      ticketData.assignedTo === currentUserLoggedIn.username
                        ? 'success'
                        : ticketData.assignedTo
                        ? 'error'
                        : 'warning'
                    "
                    class="mr-2"
                  >
                    {{
                      ticketData.assignedTo &&
                      currentUserLoggedIn.username &&
                      ticketData.assignedTo === currentUserLoggedIn.username
                        ? "mdi-account-check"
                        : ticketData.assignedTo
                        ? "mdi-account-alert"
                        : "mdi-account-question"
                    }}
                  </v-icon>
                  <div>
                    <div
                      v-if="
                        ticketData.assignedTo && currentUserLoggedIn.username
                      "
                    >
                      <span
                        v-if="
                          ticketData.assignedTo === currentUserLoggedIn.username
                        "
                      >
                        <strong>Assigned to you</strong> ({{
                          ticketData.assignedTo
                        }})
                      </span>
                      <span v-else>
                        The ticket has been assigned to
                        <strong>{{ ticketData.assignedTo }}</strong
                        >, and you are currently logged in as Agent
                        {{ currentUserLoggedIn.username }}.
                      </span>
                    </div>
                    <div v-else>
                      <strong>Ticket is not assigned to anyone.</strong>
                    </div>
                  </div>
                </div>
              </v-card>

              <!-- Actions Card -->
              <v-card outlined class="mb-4">
                <v-tabs
                  v-model="activeTab"
                  background-color="primary"
                  dark
                  grow
                >
                  <v-tab>
                    <v-icon left>mdi-star</v-icon>
                    Recommended
                  </v-tab>
                  <v-tab>
                    <v-icon left>mdi-format-list-bulleted</v-icon>
                    All Actions
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="activeTab">
                  <!-- Recommended Actions Tab -->
                  <v-tab-item>
                    <v-card flat>
                      <!-- Closed - Won State -->
                      <v-card-text
                        v-if="ticketData.currentStage === 'Closed - Won'"
                      >
                        <div class="d-flex pa-2">
                          <v-avatar color="success" class="mr-4">
                            <v-icon dark>mdi-thumb-up</v-icon>
                          </v-avatar>
                          <div>
                            <h3 class="text-h6 success--text font-weight-bold">
                              Lead Converted
                            </h3>
                            <p class="mb-0">
                              Well done! This lead has already been successfully
                              converted.
                            </p>
                          </div>
                        </div>
                      </v-card-text>

                      <!-- Closed - Lost State -->
                      <v-card-text
                        v-else-if="ticketData.currentStage === 'Closed - Lost'"
                      >
                        <div class="d-flex pa-2">
                          <v-avatar color="error" class="mr-4">
                            <v-icon dark>mdi-account-cancel</v-icon>
                          </v-avatar>
                          <div>
                            <h3 class="text-h6 error--text font-weight-bold">
                              Lead Closed
                            </h3>
                            <p>
                              Though this lead wasn't converted, every closed
                              opportunity presents a chance for growth and
                              improvement. Stay focused and keep pushing
                              forward. Your dedication is commendable!
                            </p>
                          </div>
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <div class="d-flex pa-2">
                          <v-avatar color="primary" class="mr-4">
                            <v-icon dark>mdi-repeat</v-icon>
                          </v-avatar>
                          <div>
                            <h3 class="text-h6 primary--text font-weight-bold">
                              Reinitiate
                            </h3>
                            <p>
                              If the lead was closed by mistake or the customer
                              wants to re-initiate the loan, here are some
                              appropriate actions to consider:
                            </p>
                            <div class="d-flex flex-wrap">
                              <v-btn
                                color="success"
                                class="mr-2 mb-2"
                                rounded
                                depressed
                                large
                                @click="scheduleLeadShowroomDialog = true"
                              >
                                <v-icon left>mdi-store</v-icon>
                                Schedule Showroom
                              </v-btn>
                              <v-btn
                                color="primary"
                                outlined
                                rounded
                                depressed
                                large
                                class="mb-2"
                                @click="scheduleLeadDialog = true"
                              >
                                <v-icon left>mdi-calendar</v-icon>
                                {{
                                  ticketData.currentStage === "Rescheduled"
                                    ? "Re-Schedule"
                                    : "Schedule"
                                }}
                              </v-btn>
                            </div>
                          </div>
                        </div>
                      </v-card-text>

                      <!-- Active Lead States -->
                      <v-card-text v-else>
                        <!-- Showroom Visit Scheduled -->
                        <v-alert
                          v-if="
                            ticketData.currentStage ===
                              'Showroom Visit Scheduled' &&
                            ticketData.showroomSchedule
                          "
                          dense
                          border="left"
                          colored-border
                          :color="
                            checkOverdueColor(ticketData.showroomSchedule.date)
                          "
                          class="mb-4"
                        >
                          <div class="font-weight-bold">
                            {{ checkOverdue(ticketData.showroomSchedule.date) }}
                          </div>
                          <div>
                            Showroom Visit Scheduled for:
                            <strong>{{
                              ticketData.showroomSchedule.date | moment("lll")
                            }}</strong>
                          </div>
                        </v-alert>

                        <!-- Delivery Scheduled -->
                        <v-alert
                          v-if="
                            ticketData.currentStage === 'Delivery Scheduled' &&
                            ticketData.deliverySchedule
                          "
                          dense
                          border="left"
                          colored-border
                          :color="
                            checkOverdueColor(ticketData.deliverySchedule.date)
                          "
                          class="mb-4"
                        >
                          <div class="font-weight-bold">
                            {{ checkOverdue(ticketData.deliverySchedule.date) }}
                          </div>
                          <div>
                            Delivery Scheduled for:
                            <strong>{{
                              ticketData.deliverySchedule.date | moment("lll")
                            }}</strong>
                          </div>
                        </v-alert>

                        <h3 class="text-h6 font-weight-bold mb-3">
                          <v-icon color="primary" class="mr-2"
                            >mdi-arrow-right-bold</v-icon
                          >
                          Recommended Next Action
                        </h3>

                        <!-- Fresh Lead / Rescheduled / Contacted -->
                        <v-card
                          v-if="
                            ticketData.currentStage === 'Fresh Lead' ||
                            ticketData.currentStage === 'Rescheduled' ||
                            ticketData.currentStage === 'Contacted'
                          "
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark>mdi-store-clock</v-icon>
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Schedule Showroom Visit
                              </h4>
                              <p class="mb-4">
                                Encourage the customer to visit the showroom or
                                schedule for a later time.
                              </p>
                              <div class="d-flex flex-wrap">
                                <v-btn
                                  color="success"
                                  rounded
                                  depressed
                                  large
                                  class="mr-2 mb-2"
                                  @click="scheduleLeadShowroomDialog = true"
                                >
                                  <v-icon left>mdi-store</v-icon>
                                  Schedule Showroom Visit
                                </v-btn>
                                <v-btn
                                  v-if="ticketData.currentStage !== 'Contacted'"
                                  color="primary"
                                  outlined
                                  rounded
                                  depressed
                                  large
                                  class="mb-2"
                                  @click="markContactedDialog = true"
                                >
                                  <v-icon left>mdi-account-check</v-icon>
                                  Mark Contacted
                                </v-btn>
                              </div>
                            </div>
                          </div>
                        </v-card>

                        <!-- Showroom Visit Scheduled / Showroom Visited -->
                        <v-card
                          v-if="
                            ticketData.currentStage ===
                              'Showroom Visit Scheduled' ||
                            ticketData.currentStage === 'Showroom Visited'
                          "
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark>mdi-note-check-outline</v-icon>
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Log in
                              </h4>
                              <p class="mb-4">
                                Record if the customer initiates the application
                                process at the showroom.
                              </p>
                              <div class="d-flex flex-wrap">
                                <v-btn
                                  color="success"
                                  rounded
                                  depressed
                                  large
                                  class="mr-2 mb-2"
                                  @click="markQuotationSharedDialog = true"
                                >
                                  <v-icon left
                                    >mdi-file-document-outline</v-icon
                                  >
                                  Mark Quotation Shared
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  outlined
                                  rounded
                                  depressed
                                  large
                                  class="mb-2"
                                  @click="scheduleLeadShowroomDialog = true"
                                >
                                  <v-icon left>mdi-calendar-refresh</v-icon>
                                  Re-schedule Showroom Visit
                                </v-btn>
                              </div>
                            </div>
                          </div>

                          <v-divider class="my-4"></v-divider>

                          <div class="pa-2">
                            <p>
                              If the customer has just visited the showroom and
                              no action was taken, mark just visit record:
                            </p>
                            <v-btn
                              color="primary"
                              outlined
                              rounded
                              depressed
                              large
                              @click="markShowroomVisitedDialog = true"
                            >
                              <v-icon left>mdi-eye-check-outline</v-icon>
                              Mark Showroom Visited
                            </v-btn>
                          </div>
                        </v-card>

                        <!-- Quotation Shared -->
                        <v-card
                          v-if="ticketData.currentStage === 'Quotation Shared'"
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark
                                >mdi-checkbox-marked-circle-outline</v-icon
                              >
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Confirm Booking
                              </h4>
                              <p class="mb-4">
                                Record if the customer initiates the payment and
                                gives some advance at the showroom.
                              </p>
                              <v-btn
                                color="success"
                                rounded
                                depressed
                                large
                                @click="markBookingConfirmedDialog = true"
                              >
                                <v-icon left
                                  >mdi-checkbox-marked-circle-outline</v-icon
                                >
                                Mark Booking Confirmed
                              </v-btn>
                            </div>
                          </div>
                        </v-card>

                        <!-- Booking Confirmed -->
                        <v-card
                          v-if="ticketData.currentStage === 'Booking Confirmed'"
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark>mdi-moped</v-icon>
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Next Steps
                              </h4>
                              <p class="mb-4">
                                Choose the appropriate next action for this
                                booking:
                              </p>
                              <div class="d-flex flex-wrap">
                                <v-btn
                                  color="success"
                                  rounded
                                  depressed
                                  large
                                  class="mr-2 mb-2"
                                  @click="markDeliveryScheduledDialog = true"
                                >
                                  <v-icon left>mdi-moped-outline</v-icon>
                                  Mark Delivery Scheduled
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  outlined
                                  rounded
                                  depressed
                                  large
                                  class="mb-2"
                                  @click="marRtoAndDocumentationDialog = true"
                                >
                                  <v-icon left>mdi-file-document</v-icon>
                                  Mark RTO & Documentation
                                </v-btn>
                              </div>
                            </div>
                          </div>
                        </v-card>

                        <!-- Delivery Scheduled -->
                        <v-card
                          v-if="
                            ticketData.currentStage === 'Delivery Scheduled'
                          "
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark>mdi-file-document</v-icon>
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Documentation
                              </h4>
                              <p class="mb-4">
                                Once the delivery is scheduled and delivered,
                                please mark it sent for RTO & Documentation
                              </p>
                              <v-btn
                                color="success"
                                rounded
                                depressed
                                large
                                @click="marRtoAndDocumentationDialog = true"
                              >
                                <v-icon left>mdi-file-document</v-icon>
                                Mark RTO & Documentation
                              </v-btn>
                            </div>
                          </div>
                        </v-card>

                        <!-- RTO & Documentation -->
                        <v-card
                          v-if="
                            ticketData.currentStage === 'RTO & Documentation'
                          "
                          outlined
                          class="mb-4 pa-4"
                        >
                          <div class="d-flex">
                            <v-avatar color="success" class="mr-4">
                              <v-icon dark>mdi-trophy-award</v-icon>
                            </v-avatar>
                            <div>
                              <h4 class="text-subtitle-1 font-weight-bold">
                                Complete Sale
                              </h4>
                              <p class="mb-4">
                                Once the RTO & Documentation is done, please
                                mark it as WON.
                              </p>
                              <v-btn
                                color="success"
                                rounded
                                depressed
                                large
                                @click="markClosedWonDialog = true"
                              >
                                <v-icon left>mdi-trophy-award</v-icon>
                                Close & Mark as 'Won'
                              </v-btn>
                            </div>
                          </div>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <!-- All Actions Tab -->
                  <v-tab-item>
                    <v-list dense>
                      <v-subheader>Available Actions</v-subheader>

                      <v-list-item @click="scheduleLeadDialog = true">
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-calendar-edit</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{
                              ticketData.currentStage === "Rescheduled"
                                ? "Re-Schedule"
                                : "Schedule"
                            }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="scheduleLeadShowroomDialog = true">
                        <v-list-item-icon>
                          <v-icon color="success">mdi-storefront</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Schedule Showroom</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markContactedDialog = true">
                        <v-list-item-icon>
                          <v-icon color="info">mdi-account-check</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Mark Contacted</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markQuotationSharedDialog = true">
                        <v-list-item-icon>
                          <v-icon color="success"
                            >mdi-file-document-outline</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Mark Quotation Shared</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markShowroomVisitedDialog = true">
                        <v-list-item-icon>
                          <v-icon color="primary">mdi-eye-check-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Mark Showroom Visited</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markBookingConfirmedDialog = true">
                        <v-list-item-icon>
                          <v-icon color="success"
                            >mdi-checkbox-marked-circle-outline</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Mark Booking Confirmed</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markDeliveryScheduledDialog = true">
                        <v-list-item-icon>
                          <v-icon color="purple">mdi-moped-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Mark Delivery Scheduled</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="marRtoAndDocumentationDialog = true">
                        <v-list-item-icon>
                          <v-icon color="warning">mdi-file-document</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Mark RTO & Documentation</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markClosedWonDialog = true">
                        <v-list-item-icon>
                          <v-icon color="success">mdi-trophy-award</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Close & Mark as 'Won'</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item @click="markTicketClosed()">
                        <v-list-item-icon>
                          <v-icon color="error">mdi-close-box</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-bold"
                            >Close Ticket</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Not Found State -->
    <v-container
      v-else
      class="py-15 text-center mx-auto"
      style="max-width: 700px"
    >
      <v-card class="pa-6">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-h4 error--text mb-2">404</h2>
        <h3 class="text-h5 mb-6">Ticket not found!</h3>
        <div class="text-subtitle-1 mb-4">Ref LAN - {{ applicationId }}</div>
        <v-alert type="info" outlined class="text-left">
          Please note: Tickets will be available in the sales funnel only if
          they are created from the LMS dashboard or through our backend bot,
          and only when they qualify for further processing.
        </v-alert>
      </v-card>
    </v-container>

    <!-- Loading Overlay -->
    <!-- <v-overlay v-model="overlayLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->

    <!-- DIALOGS -->
    <!-- Mark Contacted Dialog -->
    <v-dialog scrollable max-width="500" v-model="markContactedDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark as Contacted
            </span>
            <v-btn icon @click="markContactedDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Card Content -->
          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            />
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markContactedDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="primary"
              rounded
              large
              depressed
              @click="markStage('Contacted')"
            >
              <v-icon left>mdi-check</v-icon>
              Mark Contacted
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Schedule Lead Dialog -->
    <v-dialog scrollable max-width="500" v-model="scheduleLeadDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text"
              >Schedule Lead</span
            >
            <v-btn icon @click="scheduleLeadDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Card Content -->
          <div class="pt-4">
            <div class="mb-4">
              <date-time-picker
                class="ma-0 pa-0"
                hide-details
                dense
                v-model="scheduledDate"
              />
              <v-alert v-if="scheduledDate" dense type="info" class="mt-3">
                Scheduling for:
                <strong>{{ scheduledDate | moment("lll") }}</strong>
              </v-alert>
            </div>

            <v-textarea
              outlined
              v-model="scheduledComment"
              label="Comment"
              placeholder="Add comment"
              rows="4"
            />
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="scheduleLeadDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!scheduledComment || !scheduledDate"
              color="primary"
              rounded
              large
              depressed
              @click="scheduleTicket"
            >
              <v-icon left>mdi-calendar-check</v-icon>
              Schedule
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Schedule Showroom Visit Dialog -->
    <v-dialog scrollable max-width="500" v-model="scheduleLeadShowroomDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Schedule Showroom Visit
            </span>
            <v-btn icon @click="scheduleLeadShowroomDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Card Content -->
          <div class="pt-4">
            <div class="mb-4">
              <date-time-picker
                v-model="scheduleLeadShowroomDate"
                class="ma-0 pa-0"
                hide-details
                dense
              />
              <v-alert
                v-if="scheduleLeadShowroomDate"
                dense
                type="info"
                class="mt-3"
              >
                Scheduling for:
                <strong>{{ scheduleLeadShowroomDate | moment("lll") }}</strong>
              </v-alert>
            </div>

            <v-text-field
              outlined
              v-model="scheduleLeadShowroomLocation"
              label="Location"
              placeholder="Enter showroom location"
              prepend-inner-icon="mdi-map-marker"
              class="mb-4"
            />

            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment"
              rows="3"
            />
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="scheduleLeadShowroomDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment || !scheduleLeadShowroomDate"
              color="success"
              rounded
              large
              depressed
              @click="scheduleShowroomVisitTicket()"
            >
              <v-icon left>mdi-store-check</v-icon>
              Schedule Visit
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark Showroom Visited Dialog -->
    <v-dialog scrollable max-width="500" v-model="markShowroomVisitedDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark Showroom Visited
            </span>
            <v-btn icon @click="markShowroomVisitedDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            />
          </div>

          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markShowroomVisitedDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="primary"
              rounded
              large
              depressed
              @click="markStage('Showroom Visited')"
            >
              <v-icon left>mdi-check</v-icon>
              Mark Visited
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark Delivery Scheduled Dialog -->
    <v-dialog scrollable max-width="500" v-model="markDeliveryScheduledDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Schedule Delivery
            </span>
            <v-btn icon @click="markDeliveryScheduledDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="pt-4">
            <div class="mb-4">
              <date-time-picker v-model="schedulDeliveryDate" />
              <v-alert
                v-if="schedulDeliveryDate"
                dense
                type="info"
                class="mt-3"
              >
                Scheduling for:
                <strong>{{ schedulDeliveryDate | moment("lll") }}</strong>
              </v-alert>
            </div>

            <v-text-field
              outlined
              v-model="deliveryLocation"
              label="Delivery Location"
              placeholder="Enter delivery location"
              prepend-inner-icon="mdi-map-marker"
              class="mb-4"
            />

            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment"
              rows="3"
            />
          </div>

          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markDeliveryScheduledDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment || !schedulDeliveryDate"
              color="success"
              rounded
              large
              depressed
              @click="scheduleDeliveryTicket"
            >
              <v-icon left>mdi-moped</v-icon>
              Schedule Delivery
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark Quotation Shared Dialog -->
    <v-dialog scrollable max-width="500" v-model="markQuotationSharedDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark Quotation Shared
            </span>
            <v-btn icon @click="markQuotationSharedDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            />
          </div>

          <div class="d-flex justify-end">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markQuotationSharedDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="success"
              rounded
              large
              depressed
              @click="markStage('Quotation Shared')"
            >
              <v-icon left>mdi-check</v-icon>
              Mark Quotation Shared
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark Booking Confirmed Dialog -->
    <v-dialog scrollable max-width="500" v-model="markBookingConfirmedDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark Booking Confirmed
            </span>
            <v-btn icon @click="markBookingConfirmedDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            ></v-textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markBookingConfirmedDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="success"
              rounded
              large
              depressed
              @click="markStage('Booking Confirmed')"
            >
              <v-icon left>mdi-check</v-icon>
              Mark Booking Confirmed
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark RTO & Documentation Dialog -->
    <v-dialog scrollable max-width="500" v-model="marRtoAndDocumentationDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark RTO & Documentation
            </span>
            <v-btn icon @click="marRtoAndDocumentationDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            ></v-textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="marRtoAndDocumentationDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="success"
              rounded
              large
              depressed
              @click="markStage('RTO & Documentation')"
            >
              <v-icon left>mdi-check</v-icon>
              Mark RTO & Documentation
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Mark Closed Won Dialog -->
    <v-dialog scrollable max-width="500" v-model="markClosedWonDialog">
      <v-card :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Mark Closed - Won
            </span>
            <v-btn icon @click="markClosedWonDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div class="pt-4">
            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
            ></v-textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="markClosedWonDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="success"
              rounded
              large
              depressed
              @click="markStage('Closed - Won')"
            >
              <v-icon left>mdi-trophy</v-icon>
              Mark Closed - Won
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Close Ticket Dialog -->
    <v-dialog max-width="600" scrollable v-model="closeTicketDialog">
      <v-card style="overflow-x: auto" :loading="overlayLoading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Close Ticket
            </span>
            <v-btn icon @click="closeTicketDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div class="pt-4">
            <h3 class="text-subtitle-1 font-weight-medium mb-3">Top Reasons</h3>
            <v-chip-group v-model="resonsForClosing" multiple column>
              <v-chip
                v-for="(reason, index) in topReasons"
                :key="index"
                filter
                outlined
                :value="reason"
                color="primary"
              >
                {{ reason }}
              </v-chip>
            </v-chip-group>

            <v-expansion-panels v-model="expandedPanel" flat class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-header class="primary--text">
                  Other Reasons
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group v-model="resonsForClosing" multiple column>
                    <v-chip
                      v-for="(reason, index) in reasons"
                      :key="index"
                      filter
                      outlined
                      :value="reason"
                      color="primary"
                    >
                      {{ reason }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-textarea
              outlined
              v-model="comment"
              label="Comment"
              placeholder="Add comment, also include phone number if available"
              rows="4"
              class="mt-4"
            ></v-textarea>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4" v-show="expandedPanel !== 0">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="closeTicketDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!comment"
              color="error"
              rounded
              large
              depressed
              @click="markTicketClosed()"
            >
              <v-icon left>mdi-close-circle</v-icon>
              Close Ticket
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Update Call Status Dialog -->
    <v-dialog scrollable max-width="500" v-model="updateCallStatusModal">
      <v-card v-if="ticketData" :loading="loading">
        <v-container class="pa-4">
          <!-- Header -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-medium primary--text">
              Update Call Status
            </span>
            <v-btn icon @click="updateCallStatusModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Content -->
          <div class="pt-4">
            <v-select
              label="Select Call Status"
              v-model="callStatusSelected"
              :items="availableCallStatuses"
              outlined
              prepend-inner-icon="mdi-phone"
            ></v-select>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-end mt-4">
            <v-btn
              text
              rounded
              large
              class="mr-2"
              @click="updateCallStatusModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="callStatusSelected == ticketData.callStatus"
              color="primary"
              rounded
              large
              depressed
              @click="updateCallStatus"
            >
              <v-icon left>mdi-check</v-icon>
              Update
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import moment from "moment";
import DateTimePicker from "@/components/DateTimePicker.vue";
import Swal from "sweetalert2";

export default {
  components: { DateTimePicker },
  data() {
    return {
      // Lead metadata
      applicationId: this.$route.params.id,
      ticketData: null,
      ticketComments: [],

      availableCallStatuses: [
        "default",
        "Not Reachable",
        "Reachable",
        "Incoming Barred",
        "Not Connected",
        "Switched Off",
        "Repeated",
        "RNR",
      ],

      // UI flags
      loading: false,
      overlayLoading: false,

      // Dialog toggles
      scheduleLeadDialog: false,
      scheduleLeadShowroomDialog: false,
      markQuotationSharedDialog: false,
      markRtoAndDocumentationDialog: false,
      markContactedDialog: false,
      markShowroomVisitedDialog: false,
      markDeliveryScheduledDialog: false,
      markBookingConfirmedDialog: false,
      marRtoAndDocumentationDialog: false,
      markClosedWonDialog: false,
      closeTicketDialog: false,

      // Form fields
      comment: "",
      scheduledComment: "",
      scheduledDate: null,
      schedulDeliveryDate: null,
      deliveryLocation: null,
      scheduledDateTime: null,
      scheduleLeadShowroomDate: moment().format("YYYY-MM-DD"),
      scheduleLeadShowroomLocation: "",
      updateCallStatusModal: false,

      // Calendar
      today: moment().format("YYYY-MM-DD"),
      maxDate: moment().add(2, "months").format("YYYY-MM-DD"),

      // Closing reasons
      resonsForClosing: [],
      topReasons: [
        "Not Connected",
        "RNR",
        "Not Interested",
        "Already Purchased",
        "Down Payment Issue",
        "Not Serviceable",
        "Doubtful",
        "Language Barrier",
        "High Interest Rates",
      ],
      reasons: [
        "Not Satisfied with Offer",
        "Unavailability of Required Documents",
        "Change in Circumstances",
        "Trust Issues",
        "Vehicle Model Unavailable",
        "Preference for Different Financing Option",
        "Long Processing Time",
        "Poor Credit Score",
        "Poor Customer Service",
        "Already Applied Elsewhere",
        "Unfavorable Loan Terms",
        "Financial Ineligibility",
        "Unstable Employment",
        "Legal Issues",
        "Unexpected Expenses",
        "Inadequate Loan Amount Offered",
        "Complicated Application Process",
        "Not Meeting Age Requirements",
        "Concerns About Vehicle Reliability",
        "Not Approved by Lender",
        "No Guarantor Available",
        "Concerns About Vehicle Resale Value",
        "Not Ready to Commit",
        "Other",
      ],

      // Unused but reserved for future API data
      spocsList: [],
      idfcDealersList: [],
      preferredDealerList: [],
      loanData: [],
      callStatusSelected: "",
      activeTab: 0,
      expandedPanel: "",
    };
  },

  created() {
    this.fetchticketData();
    this.fetchComments();
  },

  computed: {
    currentUserLoggedIn() {
      return this.$store.getters.getLoggedInUser;
    },
  },
  methods: {
    getIcon(stage) {
      switch (stage) {
        case "stage_change":
          return "mdi-phone";
        case "callstatus_change": // Example: add another case for a different stage
          return "mdi-all-inclusive";
        case "chat":
          return "mdi-chat-outline"; // Example: another stage
        default:
          return "mdi-chat-outline"; // Default icon for unknown stages
      }
    },
    checkOverdue(dateString) {
      const date = moment(dateString, "YYYY-MM-DD");
      const today = moment().startOf("day");
      if (date.isSame(today, "day")) return "Scheduled Today";
      if (date.isBefore(today, "day")) return "Overdue";
      return "Scheduled";
    },

    checkOverdueColor(dateString) {
      const date = moment(dateString, "YYYY-MM-DD");
      const today = moment().startOf("day");
      if (date.isSame(today, "day")) return "warning";
      if (date.isBefore(today, "day")) return "error";
      return "success";
    },

    async fetchticketData() {
      this.loading = true;
      try {
        const { data } = await HTTP.get(`drivex/leads/${this.applicationId}`);
        this.ticketData = data;
        this.callStatusSelected = data.callStatus;
        await this.$store.dispatch("getLeadStagesList");
      } catch (error) {
        console.log(error.data?.data?.message || "Failed to update pin/unpin.");
      } finally {
        this.loading = false;
      }
    },

    async updateCallStatus() {
      this.loading = true;
      try {
        const response = await HTTP.put(
          `drivex/leads/${this.applicationId}/update/call-status`,
          {
            callStatus: this.callStatusSelected,
            currentCallStatus: this.ticketData.callStatus,
          }
        );

        Swal.fire({
          title: "Success",
          text: response.data?.message || "Call status updated!",
          icon: "success",
          confirmButtonText: "OK",
        });

        this.comment = "";
        this.fetchComments();
        this.updateCallStatusModal = false;
        this.ticketData.callStatus = this.callStatusSelected;
      } catch (error) {
        console.error("Call status update error:", error);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchComments() {
      this.overlayLoading = true;
      try {
        const { data } = await HTTP.get(
          `drivex/leads/${this.applicationId}/comments`
        );
        this.ticketComments = data;
      } catch (error) {
        console.error("Error Comment while fetching:", error);
      } finally {
        this.overlayLoading = false;
      }
    },

    async changePinnedStatus(pinned) {
      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/pin`,
          {
            pinned,
          }
        );
        console.log("Changed pin/unpin:", response);
      } catch (error) {
        console.log(
          error.response?.data?.message || "Failed to update pin/unpin."
        );
      } finally {
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async addComment() {
      if (!this.comment) return;

      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/comments`,
          {
            comment: this.comment,
          }
        );

        this.comment = "";
        await this.fetchComments();

        Swal.fire({
          icon: "success",
          title: "Comment Added",
          text: response?.data?.message || "Your comment added successfully.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Comment",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    async scheduleShowroomVisitTicket() {
      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/stage`,
          {
            comment: this.comment,
            showroomSchedule: {
              date: this.scheduleLeadShowroomDate,
              time: "",
              location: this.scheduleLeadShowroomLocation,
            },
            newStage: "Showroom Visit Scheduled",
          }
        );

        this.scheduleLeadShowroomDialog = false;
        this.comment = "";

        await this.fetchComments();
        await this.fetchticketData();

        Swal.fire({
          icon: "success",
          title: "Showroom Visit Scheduled",
          text:
            response?.data?.message || "Showroom visit scheduled successfully.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // console.error("Error scheduling showroom visit:", error);
        Swal.fire({
          icon: "error",
          title: "Scheduling Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    async scheduleDeliveryTicket() {
      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/stage`,
          {
            comment: this.comment,
            deliverySchedule: {
              date: this.schedulDeliveryDate,
              time: "",
              location: this.deliveryLocation,
            },
            newStage: "Delivery Scheduled",
          }
        );

        this.markDeliveryScheduledDialog = false;
        this.comment = "";

        this.fetchComments();
        this.fetchticketData();

        Swal.fire({
          icon: "success",
          title: "Delivery Scheduled",
          text:
            response?.data?.message ||
            "The delivery has been scheduled successfully.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // console.error("Error scheduling delivery:", error);
        Swal.fire({
          icon: "error",
          title: "Scheduling Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    async scheduleTicket() {
      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/stage`,
          {
            comment: this.scheduledComment,
            rescheduleDate: this.scheduledDate,
            newStage: "Rescheduled",
          }
        );

        this.scheduleLeadDialog = false;
        this.scheduledComment = "";

        await this.fetchComments();
        await this.fetchticketData();

        Swal.fire({
          icon: "success",
          title: "Lead Rescheduled",
          text:
            response?.data?.message ||
            "The lead has been successfully rescheduled.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // console.error('Error rescheduling lead:', error);
        Swal.fire({
          icon: "error",
          title: "Reschedule Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    async markStage(newStage) {
      if (!this.comment) return;

      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/stage`,
          {
            comment: this.comment,
            newStage,
          }
        );

        this.comment = "";
        this.closeDialogs();

        this.fetchComments();
        this.fetchticketData();

        Swal.fire({
          icon: "success",
          title: "Stage Updated",
          text: response?.data?.message || `Lead moved to stage: ${newStage}`,
          confirmButtonText: "OK",
        });
      } catch (error) {
        // console.error('Error updating stage:', error);
        Swal.fire({
          icon: "error",
          title: "Stage Update Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    async markTicketClosed() {
      this.overlayLoading = true;
      try {
        const response = await HTTP.post(
          `drivex/leads/${this.applicationId}/update/stage`,
          {
            comment: this.comment,
            newStage: "Closed - Lost",
            resonsForClosing: this.resonsForClosing,
          }
        );

        this.comment = "";
        this.closeTicketDialog = false;

        this.fetchComments();
        this.fetchticketData();

        Swal.fire({
          icon: "success",
          title: "Ticket Closed",
          text:
            response?.data?.message ||
            "The ticket has been marked as Closed - Lost.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // console.error('Error closing ticket:', error);
        Swal.fire({
          icon: "error",
          title: "Close Failed",
          text:
            error?.response?.data?.message ||
            "Something went wrong while closing the ticket.",
          confirmButtonText: "OK",
        });
      } finally {
        this.overlayLoading = false;
      }
    },

    closeDialogs() {
      this.markRtoAndDocumentationDialog = false;
      this.markContactedDialog = false;
      this.markShowroomVisitedDialog = false;
      this.markDeliveryScheduledDialog = false;
      this.markQuotationSharedDialog = false;
      this.markBookingConfirmedDialog = false;
      this.marRtoAndDocumentationDialog = false;
      this.markClosedWonDialog = false;
    },
  },
};
</script>

<style scoped>
.fixed-top {
  position: sticky;
  top: 90px;
  z-index: 2;
}
</style>
