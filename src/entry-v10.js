import "./runtime-v10.js";

const admin = new URLSearchParams(window.location.search).get("admin") === "1";
if(admin){
  import("./admin-v11.jsx");
}else{
  import("./main-v10.jsx");
}
