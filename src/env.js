(function (window) {
  window.__env = window.__env || {};

  // API url Graphql
  // window.__env.GRAPHQL_API = 'http://127.0.0.1:50030';
  // window.__env.REST_API = 'http://127.0.0.1:50040';
  window.__env.GRAPHQL_API = 'http://54.218.165.69:6060';
  window.__env.REST_API = 'http://54.218.165.69:6061';
  window.__env.ECM_CONFIGURATION_URL = 'http://ecapture.co:3007/configuration';
  window.__env.API_VERSION = '/api/v2';
  window.__env.ECM_DOCPOP_BASE_URL = 'http://ecatch.ecapture.com.co';
  window.__env.APP_KEY = 'ECATCHFRONTENDBY';
  window.__env.GOOGLE_RECAPTCHA_SITEKEY = ''//'6LeVEagUAAAAACKCvA_vogrOvukseRPielnEgp56';
  window.__env.AUTOLOGIN = true;
  window.__env.AUTOLOGIN_USER = '';
  window.__env.AUTOLOGIN_PASSWORD = '';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
})(this);
