import type { Config } from "@react-router/dev/config";

export default {
  // The app is a fully client-side search experience talking directly to the
  // backend API from the browser, so server rendering is disabled.
  ssr: false,
} satisfies Config;
