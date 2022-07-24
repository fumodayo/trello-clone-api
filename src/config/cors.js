import { WHITELIST_DOMAIN } from "*/utilities/constants";

export const corsOptions = {
  origin: function (origin, callback) {
    // domain is allowed to access the server
    if (WHITELIST_DOMAIN.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not allow by CORS.`));
    }
  },
  optionsSuccessStatus: 200,
};
