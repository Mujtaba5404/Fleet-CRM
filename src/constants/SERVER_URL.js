const useProxy = import.meta.env.DEV;

export const SERVER_URL = useProxy
  ? "/fleet-api/"
  : "https://rv10n5m4-8005.inc1.devtunnels.ms/";

export const AUTH_SERVER_URL = useProxy
  ? "/auth-api/"
  : "https://rv10n5m4-8004.inc1.devtunnels.ms/";
