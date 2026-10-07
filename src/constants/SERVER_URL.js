// Dev goes through the Vite proxy (see vite.config.js) so session cookies work
// on localhost; production builds call the backends directly.
const useProxy = import.meta.env.DEV;

export const SERVER_URL = useProxy
  ? "/fleet-api/"
  : "https://rv10n5m4-8005.inc1.devtunnels.ms/";

export const AUTH_SERVER_URL = useProxy
  ? "/auth-api/"
  : "https://rv10n5m4-8004.inc1.devtunnels.ms/";
