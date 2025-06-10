// mixins/statusColorMixin.js
export const globalFunctionsMixin = {
  methods: {
    getStatusColor(status) {
      const statusColors = {
        "Fresh Lead": "#4B4B4B",
        Contacted: "#B36B00",
        Rescheduled: "#C0392B",
        "Showroom Visit": "#946900",
        "Showroom Visited": "#946900",
        "Quotation Shared": "#117627",
        "Booking Confirmed": "#117627",
        "RTO & Documentation": "#5D3A00",
        "Delivery Scheduled": "#117627",
        "Closed - Won": "#117627",
        "Closed - Lost": "#C0392B",
      };

      return statusColors[status] || "#4B4B4B"; // default color if status not found
    },
    getCallStatusColor(status) {
      const callStatusColors = {
        default: "#4B4B4B",
        "Not Reachable": "#FF5733", // example: reddish-orange
        Reachable: "#28A745", // example: green
        "Incoming Barred": "#FFC107", // example: amber/yellow
        "Not Connected": "#DC3545", // example: red
        "Switched Off": "#6C757D", // example: gray
        Repeated: "#17A2B8", // example: cyan
        RNR: "#6610f2", // example: purple (RNR: Ring No Response)
      };

      return callStatusColors[status] || callStatusColors["default"];
    },
  },
};
