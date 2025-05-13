import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
  position: "top-right",
  duration: 4000,
});

export default {
  success(message) {
    toaster.show(message, { type: "success" });
  },
  error(message) {
    toaster.show(message, { type: "error" });
  },
  warning(message) {
    toaster.show(message, { type: "warning" });
  },
  info(message) {
    toaster.show(message, { type: "info" });
  },
};
