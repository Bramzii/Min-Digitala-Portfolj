const localHosts = new Set(["localhost", "127.0.0.1"]);
const isLocal =
  localHosts.has(window.location.hostname) && window.location.port === "3000";

export const settings = {
  IS_LOCAL: isLocal,
  BASE_API_URL: isLocal ? "http://localhost:5001" : "",
  STATIC_DATA_URL: "/data/api.json",
};
