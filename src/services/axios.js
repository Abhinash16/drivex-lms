import axios from "axios";
var baseDomain;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  // Code to be executed when the environment is localhost
  baseDomain = "http://localhost:3000";
  console.log("Running in localhost environment");
} else {
  baseDomain = "http://localhost:3000";
  // Code for other environments (e.g., production)
  console.log("Running in production environment");
}

var baseUrl = `${baseDomain}/api`;

export var HTTP = axios.create({
  baseURL: baseUrl,
});
export var HTTP2 = axios.create({
  baseURL: baseUrl,
});
export var test = axios.create({
  baseURL: baseUrl,
});
export var server = axios.create({
  baseURL: "http://159.89.164.225:45698/api/",
});
