import Cookies from "universal-cookie";

import axios from "axios";
let cookie = new Cookies();
const endpoint="http://192.168.1.31:3020/";
export const checkAuth = async () => {

  if (cookie.get("session_id")) {
    let res = await axios.post(
      endpoint+"auth",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data[0];
  } else {
    return false;
  }
};


export const logout = async () => {
  let flag = false;
  await axios
    .post(
      endpoint+"logout",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => response.data)
    .then((data) => {
      cookie.set("session_id", "", { path: "/", expires: new Date() });
      flag = data;
    });
  return flag;
};

