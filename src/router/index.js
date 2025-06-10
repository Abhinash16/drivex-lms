import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "Home",
        component: HomeView,
        redirect: "/leads",
      },
      {
        path: "/leads",
        name: " Leads",
        component: () => import("../views/LeadsView.vue"),
      },
      {
        path: "/leads-fresh-lead",
        name: "Fresh Leads",
        component: () => import("../views/TicketsList/AssignedTickets.vue"),
      },
      {
        path: "/leads-contacted",
        name: "Leads Contacted",
        component: () => import("../views/TicketsList/ContactedTickets.vue"),
      },
      {
        path: "/leads-rescheduled",
        name: "Leads Rescheduled",
        component: () => import("../views/TicketsList/ScheduledTickets.vue"),
      },
      {
        path: "/leads-closed---lost",
        name: "Leads Closed",
        component: () => import("../views/TicketsList/ClosedTickets.vue"),
      },
      {
        path: "/leads-showroom-visit-scheduled",
        name: "Leads Scheduled Showroom Visit",
        component: () =>
          import("../views/TicketsList/ScheduledShowroomVisitTickets.vue"),
      },
      {
        path: "/leads-showroom-visited",
        name: "Leads Showroom Visited",
        component: () => import("../views/TicketsList/ShowroomVisited.vue"),
      },
      {
        path: "/leads-quotation-shared",
        name: "Leads Quotation Visited",
        component: () =>
          import("../views/TicketsList/QuotationSharedTickets.vue"),
      },
      {
        path: "/leads-closed---won",
        name: "Closed Won",
        component: () => import("../views/TicketsList/ClosedWonTickets.vue"),
      },
      {
        path: "/leads-booking-confirmed",
        name: "Leads Booking Confirmed",
        component: () => import("../views/TicketsList/BookedTickets.vue"),
      },
      {
        path: "/leads-rto-&-documentation",
        name: "Leads Loanee",
        component: () =>
          import("../views/TicketsList/RTOAndDocumentationTickets.vue"),
      },
      {
        path: "/leads-delivery-scheduled",
        name: "Delivery Scheduled",
        component: () => import("../views/TicketsList/DeliveryScheduled.vue"),
      },
      {
        path: "/pinned",
        name: "Pinned",
        component: () => import("../views/TicketsList/PinnedTickets.vue"),
      },
      {
        path: "/calendar",
        name: "Calendar",
        component: () => import("../views/EventCalendar.vue"),
      },
      {
        path: "/lead/:id",
        name: `Lead View`,
        component: () => import("../views/LeadDetailsView.vue"),
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("../views/SettingsView.vue"),
      },
      {
        path: "/search",
        name: "Search",
        component: () => import("../views/SearchApplication.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        name: "Admin Homepage",
        component: () => import("../views/Admin/AdminHome.vue"),
      },
      {
        path: "agents",
        name: "Agents List",
        component: () => import("../views/Admin/AgentsList.vue"),
      },
      {
        path: "roles",
        name: "Roles List",
        component: () => import("../views/Admin/RolesList.vue"),
      },
      {
        path: "agent/:agentId",
        name: "Agent",
        component: () => import("../views/Admin/AgentDetails.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.token;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !isLoggedIn) {
    // If the route requires authentication and the user is not Quotation Shared, redirect to the login page
    next("/login?next=" + to.path);
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
