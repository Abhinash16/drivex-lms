<template>
  <div>
    <v-container class="py-15 text-center" v-if="loading && !ticketData">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </v-container>
    <v-container v-else>
      <div v-if="ticketData">
        <v-row>
          <v-col md="7" cols="12">
            <!-- <div class="text-h5">Loan Info</div> -->
            <v-row>
              <v-col>
                <v-card
                  class="my-4"
                  outlined
                  color="orange lighten-5"
                  v-if="ticketData.currentStage == 'Rescheduled'"
                >
                  <v-container>
                    <h3
                      small
                      :class="
                        checkOverdueColor(ticketData.rescheduleDate) + '--text'
                      "
                    >
                      {{ checkOverdue(ticketData.rescheduleDate) }}
                    </h3>
                    Scheduled for -

                    {{ ticketData.rescheduleDate | moment("lll") }}
                  </v-container>
                </v-card>

                <v-chip :text-color="getStatusColor(ticketData.currentStage)">{{
                  ticketData.currentStage
                }}</v-chip>

                <h1 class="mt-2">
                  {{ ticketData.customer_name }}
                </h1>
                <div>
                  <a :href="`tel:${ticketData.customer_mobile}`"
                    >Ph. {{ ticketData.customer_mobile }}</a
                  >
                </div>

                <div>
                  {{ ticketData.model }}
                </div>
                <div>
                  {{ ticketData.registration_number }}
                </div>

                <v-divider class="my-5"></v-divider>
              </v-col>
            </v-row>

            <div class="d-flex" v-if="ticketData">
              <div class="my-auto">Call Status</div>
              <v-chip
                :text-color="getCallStatusColor(ticketData.callStatus)"
                class="my-auto ml-2"
                >{{ ticketData.callStatus }}
                <v-btn
                  @click="updateCallStatusModal = true"
                  x-small
                  icon
                  class="ml-2"
                  ><v-icon size="12">mdi-pencil</v-icon></v-btn
                >
              </v-chip>
            </div>

            <div class="mt-4">
              <div class="my-2">
                <v-btn
                  v-if="
                    ticketData.currentStage == 'Fresh Lead' ||
                    ticketData.currentStage == 'Rescheduled' ||
                    ticketData.currentStage == 'Contacted'
                  "
                  color="primary"
                  text
                  depressed
                  style="text-decoration: none"
                  @click="scheduleLeadDialog = true"
                  >Schedule for Later
                  <v-icon size="15">mdi-clock-time-five-outline</v-icon>
                </v-btn>
                <v-btn
                  @click="closeTicketDialog = true"
                  color="error"
                  text
                  depressed
                  style="text-decoration: none"
                  >Close Lead
                </v-btn>
                <v-btn
                  v-if="ticketData.pinned"
                  @click="changePinnedStatus(false)"
                  color="error"
                  text
                  depressed
                  style="text-decoration: none"
                  >Unpin
                </v-btn>
                <v-btn
                  v-else
                  @click="changePinnedStatus(true)"
                  color="success"
                  text
                  depressed
                  style="text-decoration: none"
                  >Pin
                </v-btn>
              </div>
              <v-divider class="mb-0"></v-divider>
            </div>

            <v-card-text class="py-0">
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="(data, index) in ticketComments"
                  :key="index"
                  :icon="getIcon(data.type)"
                >
                  <v-row class="pt-1">
                    <v-col cols="4">
                      <div v-if="data.movedToStage">
                        <v-chip
                          :text-color="
                            data.movedToStage
                              ? getStatusColor(data.movedToStage)
                              : ''
                          "
                          x-small
                          >{{ data.movedToStage }}</v-chip
                        >
                      </div>
                      <strong>
                        <div>{{ data.createdAt | moment("ll") }}</div>
                        <div>{{ data.createdAt | moment("h:mm a") }}</div>
                      </strong>
                    </v-col>
                    <v-col>
                      <strong v-if="data.agent"
                        >{{ data.agent.username }} ({{
                          data.agent.company
                        }})</strong
                      >

                      <div>{{ data.comment }}</div>
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
            <div class="my-2">
              <v-textarea
                outlined
                v-model="comment"
                placeholder="add comment"
              ></v-textarea>
            </div>
            <div class="text-right">
              <v-btn
                :disabled="!comment"
                depressed
                rounded
                color="success"
                @click="addComment"
                >Comment
              </v-btn>
            </div>
          </v-col>
          <v-col md="5" cols="12">
            <div class="fixed-top">
              <div class="my-5">
                <v-card>
                  <v-tabs color="deep-purple accent-4" right>
                    <v-tab>Preferred</v-tab>
                    <v-tab>All Actions</v-tab>
                    <v-tab-item>
                      <v-container v-if="currentUserLoggedIn">
                        <div
                          v-if="
                            ticketData.assignedTo &&
                            currentUserLoggedIn.username
                          "
                        >
                          <v-card
                            color="red lighten-4"
                            outlined
                            v-if="
                              ticketData.assignedTo !==
                              currentUserLoggedIn.username
                            "
                          >
                            <v-container>
                              The ticket has been assigned to
                              <strong>
                                {{ ticketData.assignedTo }}
                              </strong>
                              , and you are currently logged in as Agent
                              {{ currentUserLoggedIn.username }}.
                            </v-container>
                          </v-card>
                          <v-alert type="success" outlined v-else
                            >Assigned to you ({{
                              ticketData.assignedTo
                            }})</v-alert
                          >
                        </div>
                        <v-alert type="warning" outlined v-else
                          >Ticket is not assigned to anyone.</v-alert
                        >

                        <div v-if="ticketData.currentStage == 'Closed - Won'">
                          <div class="d-flex mt-4">
                            <v-icon color="success"
                              >mdi-thumb-up-outline</v-icon
                            >
                            <div class="ml-2">
                              <h3>Lead Converted</h3>
                              <div>
                                Well done! This lead has already been
                                successfully converted.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          v-else-if="ticketData.currentStage == 'Closed - Lost'"
                        >
                          <div class="d-flex">
                            <v-icon class="mb-auto mt-1" color="error"
                              >mdi-account-sync-outline</v-icon
                            >
                            <div class="ml-2">
                              <h3 class="error--text">Lead Closed</h3>
                              <div>
                                Though this lead wasn't converted, every closed
                                opportunity presents a chance for growth and
                                improvement. Stay focused and keep pushing
                                forward. Your dedication is commendable!
                              </div>

                              <div class="d-flex mt-5">
                                <v-icon class="mb-auto mt-1" color="success"
                                  >mdi-repeat</v-icon
                                >
                                <div class="ml-2">
                                  <strong>Reinitiate</strong>

                                  <div class="mb-4 text--disabled">
                                    If the lead was closed by mistake or the
                                    customer wants to re-initiate the loan, here
                                    are some appropriate actions to consider:
                                  </div>
                                  <v-btn
                                    @click="scheduleLeadShowroomDialog = true"
                                    color="success"
                                    depressed
                                    style="text-decoration: none"
                                    >Schedule Showroom
                                  </v-btn>
                                  <v-btn
                                    text
                                    @click="scheduleLeadDialog = true"
                                    color="error"
                                    class="ml-2"
                                    style="text-decoration: none"
                                  >
                                    <span
                                      v-if="
                                        ticketData.currentStage == 'Rescheduled'
                                      "
                                      >Re-</span
                                    >
                                    Schedule
                                  </v-btn>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else>
                          <div
                            class="my-4"
                            v-if="
                              ticketData.currentStage ==
                                'Showroom Visit Scheduled' &&
                              ticketData.showroomSchedule
                            "
                          >
                            <h3
                              small
                              :class="
                                checkOverdueColor(
                                  ticketData.showroomSchedule.date
                                ) + '--text'
                              "
                            >
                              {{
                                checkOverdue(ticketData.showroomSchedule.date)
                              }}
                            </h3>
                            Showroom Visit Scheduled for -

                            {{
                              ticketData.showroomSchedule.date | moment("lll")
                            }}
                          </div>

                          <v-card
                            outlined
                            class="my-4"
                            v-if="
                              ticketData.currentStage == 'Delivery Scheduled' &&
                              ticketData.deliverySchedule
                            "
                          >
                            <v-container>
                              <h3
                                small
                                :class="
                                  checkOverdueColor(
                                    ticketData.deliverySchedule.date
                                  ) + '--text'
                                "
                              >
                                {{
                                  checkOverdue(ticketData.deliverySchedule.date)
                                }}
                              </h3>
                              <div>
                                Delivery Scheduled for -

                                {{
                                  ticketData.deliverySchedule.date
                                    | moment("lll")
                                }}
                              </div>
                            </v-container>
                          </v-card>

                          <div class="text-h7 my-4">Next Action >></div>

                          <div
                            v-if="
                              ticketData.currentStage == 'Fresh Lead' ||
                              ticketData.currentStage == 'Rescheduled' ||
                              ticketData.currentStage == 'Contacted'
                            "
                          >
                            <div class="d-flex">
                              <v-icon class="mb-auto mt-1" color="success"
                                >mdi-store-clock</v-icon
                              >
                              <div class="ml-2">
                                <strong>Schedule Showroom Visit</strong>

                                <div class="mb-4">
                                  Encourage the customer to visit the showroom
                                  or schedule for a later time.
                                </div>
                                <v-btn
                                  @click="scheduleLeadShowroomDialog = true"
                                  color="success"
                                  depressed
                                  style="text-decoration: none"
                                  >Schedule Showroom Visit
                                </v-btn>

                                <v-btn
                                  v-if="ticketData.currentStage != 'Contacted'"
                                  text
                                  @click="markContactedDialog = true"
                                  color="error"
                                  class="ml-2"
                                  style="text-decoration: none"
                                >
                                  Mark Contacted
                                </v-btn>
                              </div>
                            </div>
                          </div>

                          <div
                            v-if="
                              ticketData.currentStage ==
                                'Showroom Visit Scheduled' ||
                              ticketData.currentStage == 'Showroom Visited'
                            "
                          >
                            <div class="d-flex">
                              <v-icon class="mt-1 mb-auto" color="success"
                                >mdi-note-check-outline</v-icon
                              >
                              <div class="ml-2">
                                <h3>Log in</h3>
                                <div class="mb-4">
                                  Record if the customer initiates the
                                  application process at the showroom.
                                </div>

                                <div class="d-flex">
                                  <v-btn
                                    @click="markQuotationSharedDialog = true"
                                    color="success"
                                    depressed
                                    style="text-decoration: none"
                                  >
                                    Mark Quotation Shared
                                  </v-btn>

                                  <v-btn
                                    text
                                    @click="scheduleLeadShowroomDialog = true"
                                    color="error"
                                    class="ml-2"
                                    style="text-decoration: none"
                                    >Re-schedule showroom visit
                                  </v-btn>
                                </div>
                              </div>
                            </div>

                            <v-card
                              outlined
                              color="orange lighten-5"
                              class="mt-5"
                            >
                              <v-container>
                                <div class="my-2">
                                  If the customer have just visited the showroom
                                  and no action was taken, mark just visit
                                  record
                                </div>
                                <v-btn
                                  depressed
                                  text
                                  @click="markShowroomVisitedDialog = true"
                                  color="error"
                                  style="text-decoration: none"
                                >
                                  Mark Showroom Visited
                                </v-btn>
                              </v-container>
                            </v-card>
                          </div>

                          <div
                            v-if="ticketData.currentStage == 'Quotation Shared'"
                          >
                            <div class="mb-4">
                              Record if the customer initiates the payment and
                              gives some advance at the showroom.
                            </div>
                            <v-btn
                              @click="markBookingConfirmedDialog = true"
                              color="success"
                              depressed
                              style="text-decoration: none"
                            >
                              Mark Booking Confirmed
                            </v-btn>
                          </div>

                          <div
                            v-if="
                              ticketData.currentStage == 'Booking Confirmed'
                            "
                          >
                            <v-btn
                              @click="markDeliveryScheduledDialog = true"
                              color="success"
                              depressed
                              style="text-decoration: none"
                            >
                              Mark Delivery Scheduled
                            </v-btn>

                            <v-btn
                              @click="marRtoAndDocumentationDialog = true"
                              color="success"
                              depressed
                              style="text-decoration: none"
                            >
                              Mark RTO & Documentation
                            </v-btn>
                          </div>

                          <div
                            v-if="
                              ticketData.currentStage == 'Delivery Scheduled'
                            "
                          >
                            <div>
                              Once the delivery is scheduled and delivered,
                              please mark it sent for RTO & Documentation
                            </div>
                            <v-btn
                              class="mt-4"
                              @click="marRtoAndDocumentationDialog = true"
                              color="success"
                              depressed
                              style="text-decoration: none"
                            >
                              Mark RTO & Documentation
                            </v-btn>
                          </div>

                          <div
                            v-if="
                              ticketData.currentStage == 'RTO & Documentation'
                            "
                          >
                            <div>
                              Once the RTO & Documentation is done, please mark
                              it as WON.
                            </div>
                            <v-btn
                              @click="markClosedWonDialog = true"
                              color="success"
                              depressed
                              style="text-decoration: none"
                              class="mt-4"
                            >
                              Close & Mark as 'Won'
                            </v-btn>
                          </div>
                        </div>
                      </v-container></v-tab-item
                    >
                    <v-tab-item>
                      <v-list dense shaped>
                        <v-list-item @click="scheduleLeadDialog = true">
                          <v-list-item-content>
                            <v-list-item-title>
                              <span
                                v-if="ticketData.currentStage == 'Rescheduled'"
                                >Re-</span
                              >Schedule
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="error">mdi-calendar-edit</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="scheduleLeadShowroomDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Schedule Showroom</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success">mdi-storefront</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="markContactedDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark Contacted</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="error">mdi-account-check</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="markQuotationSharedDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark Quotation Shared</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success"
                              >mdi-file-document-outline</v-icon
                            >
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="scheduleLeadShowroomDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Re-schedule Showroom Visit</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="error">mdi-calendar-refresh</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="markShowroomVisitedDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark Showroom Visited</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="error">mdi-eye-check-outline</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="markBookingConfirmedDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark Booking Confirmed</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success"
                              >mdi-checkbox-marked-circle-outline</v-icon
                            >
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item
                          @click="markDeliveryScheduledDialog = true"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark Delivery Scheduled</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success">mdi-truck-outline</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item
                          @click="marRtoAndDocumentationDialog = true"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              >Mark RTO & Documentation</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success">mdi-file-document</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item @click="markClosedWonDialog = true">
                          <v-list-item-content>
                            <v-list-item-title
                              >Close & Mark as 'Won'</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="success">mdi-trophy-award</v-icon>
                          </v-list-item-icon>
                        </v-list-item>

                        <v-list-item
                          @click="markTicketClosed()"
                          :disabled="!comment"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              class="font-weight-bold text--primary"
                              >Close Ticket</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon color="primary">mdi-close-box</v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                      </v-list>
                    </v-tab-item>
                  </v-tabs>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else class="py-15 text-center mx-auto" style="max-width: 700px">
        <div class="error--text">
          <h2>404</h2>
          <h3>Ticket not found!</h3>
        </div>
        <div class="mt-5">Ref LAN - {{ applicationId }}</div>

        <div class="text--disabled">
          Please note: Tickets will be available in the sales funnel only if
          they are created from the LMS dashboard or through our backend bot,
          and only when they qualify for further processing.
        </div>
      </div>
    </v-container>

    <v-overlay v-model="overlayLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>

    <v-dialog scrollable max-width="500" v-model="markContactedDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('Contacted')"
            >Mark Contacted</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="scheduleLeadDialog">
      <v-sheet>
        <v-container>
          <div class="my-4">
            <date-time-picker v-model="scheduledDate"></date-time-picker>
            <div class="my-3 error--text" v-if="scheduledDate">
              Scheduling for : {{ scheduledDate | moment("lll") }}
            </div>
          </div>

          <v-textarea
            outlined
            v-model="scheduledComment"
            placeholder="add comment"
          ></v-textarea>
          <v-btn
            :disabled="!scheduledComment"
            color="primary"
            depressed
            large
            block
            @click="scheduleTicket()"
            >Schedule</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="scheduleLeadShowroomDialog">
      <v-sheet>
        <v-container>
          <div class="my-4">
            <date-time-picker
              v-model="scheduleLeadShowroomDate"
            ></date-time-picker>
            <div class="my-3 error--text" v-if="scheduleLeadShowroomDate">
              Scheduling for : {{ scheduleLeadShowroomDate | moment("lll") }}
            </div>
          </div>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment"
          ></v-textarea>
          <v-text-field
            outlined
            v-model="scheduleLeadShowroomLocation"
            placeholder="location"
          ></v-text-field>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="scheduleShowroomVisitTicket()"
            >Schedule</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="markShowroomVisitedDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('Showroom Visited')"
            >Mark Showroom Visited</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="markDeliveryScheduledDialog">
      <v-sheet>
        <v-container>
          <div class="my-4">
            <date-time-picker v-model="schedulDeliveryDate"></date-time-picker>
            <div class="my-3 error--text" v-if="schedulDeliveryDate">
              Scheduling for : {{ schedulDeliveryDate | moment("lll") }}
            </div>
          </div>

          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment"
          ></v-textarea>
          <v-text-field
            outlined
            v-model="deliveryLocation"
            placeholder="location"
          ></v-text-field>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="scheduleDeliveryTicket()"
            >Schedule</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="markQuotationSharedDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('Quotation Shared')"
            >Mark Quotation Shared</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="markBookingConfirmedDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('Booking Confirmed')"
            >Mark Booking Confirmed</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="marRtoAndDocumentationDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('RTO & Documentation')"
            >Mark RTO & Documentation</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="markClosedWonDialog">
      <v-sheet>
        <v-container>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markStage('Closed - Won')"
            >Mark Closed - Won</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>

    <v-dialog max-width="600" scrollable v-model="closeTicketDialog">
      <v-card height="100%">
        <v-container>
          <h3>Top Reasons</h3>
          <v-chip-group v-model="resonsForClosing" multiple column>
            <v-chip
              v-for="(reason, index) in topReasons"
              :key="index"
              filter
              outlined
              :value="reason"
            >
              {{ reason }}
            </v-chip>
          </v-chip-group>
          <v-card flat max-height="250px" style="overflow: scroll">
            <v-expansion-panels flat accordion>
              <v-expansion-panel>
                <v-expansion-panel-header class="primary--text"
                  >Other Reasons</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-chip-group v-model="resonsForClosing" multiple column>
                    <v-chip
                      v-for="(reason, index) in reasons"
                      :key="index"
                      filter
                      outlined
                      :value="reason"
                    >
                      {{ reason }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
          <v-textarea
            outlined
            v-model="comment"
            placeholder="add comment, also include phone number if available"
          ></v-textarea>
          <v-btn
            :disabled="!comment"
            color="primary"
            depressed
            large
            block
            @click="markTicketClosed()"
            >Close Ticket</v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog scrollable max-width="500" v-model="updateCallStatusModal">
      <v-sheet v-if="ticketData">
        <v-container>
          <v-select
            label="Select Call Status"
            v-model="callStatusSelected"
            :items="availableCallStatuses"
          ></v-select>
          <v-btn
            :disabled="callStatusSelected == ticketData.callStatus"
            color="primary"
            depressed
            large
            block
            @click="updateCallStatus"
            >Update</v-btn
          >
        </v-container>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from "@/services/axios";
import moment from "moment";
import DateTimePicker from "@/components/DateTimePicker.vue";

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
      } finally {
        this.loading = false;
      }
    },
    async updateCallStatus() {
      this.loading = true;
      try {
        await HTTP.put(
          `drivex/leads/${this.applicationId}/update/call-status`,
          {
            callStatus: this.callStatusSelected,
            currentCallStatus: this.ticketData.callStatus,
          }
        );
        this.comment = "";
        this.fetchComments();
        this.updateCallStatusModal = false;
      } finally {
        this.ticketData.callStatus = this.callStatusSelected;
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
      } finally {
        this.overlayLoading = false;
      }
    },

    async changePinnedStatus(pinned) {
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/pin`, {
          pinned,
        });
      } finally {
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async addComment() {
      if (!this.comment) return;
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/comments`, {
          comment: this.comment,
        });
        this.comment = "";
      } finally {
        this.fetchComments();
        this.overlayLoading = false;
      }
    },

    async scheduleShowroomVisitTicket() {
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/stage`, {
          comment: this.comment,
          showroomSchedule: {
            date: this.scheduleLeadShowroomDate,
            time: "",
            location: this.scheduleLeadShowroomLocation,
          },
          newStage: "Showroom Visit Scheduled",
        });
        this.scheduleLeadShowroomDialog = false;
        this.comment = "";
      } finally {
        this.fetchComments();
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async scheduleDeliveryTicket() {
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/stage`, {
          comment: this.comment,
          deliverySchedule: {
            date: this.schedulDeliveryDate,
            time: "",
            location: this.deliveryLocation,
          },
          newStage: "Delivery Scheduled",
        });
        this.markDeliveryScheduledDialog = false;
        this.comment = "";
      } finally {
        this.fetchComments();
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async scheduleTicket() {
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/stage`, {
          comment: this.scheduledComment,
          rescheduleDate: this.scheduledDate,
          newStage: "Rescheduled",
        });
        this.scheduleLeadDialog = false;
        this.scheduledComment = "";
      } finally {
        this.fetchComments();
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async markStage(newStage) {
      if (!this.comment) return;
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/stage`, {
          comment: this.comment,
          newStage,
        });
        this.comment = "";
        this.closeDialogs();
      } finally {
        this.fetchComments();
        this.fetchticketData();
        this.overlayLoading = false;
      }
    },

    async markTicketClosed() {
      this.overlayLoading = true;
      try {
        await HTTP.post(`drivex/leads/${this.applicationId}/update/stage`, {
          comment: this.comment,
          newStage: "Closed - Lost",
          resonsForClosing: this.resonsForClosing,
        });
        this.comment = "";
        this.closeTicketDialog = false;
      } finally {
        this.fetchComments();
        this.fetchticketData();
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
