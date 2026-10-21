const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:9000"
    : "https://backend-sevasetu-ckx2.onrender.com";

export default API_URL;
