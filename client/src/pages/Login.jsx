import React, { useState } from "react";
import { assets } from "../assets/assets";



const Login = () => {
  const [state, setState] = useState("signup");
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from blue-200 to-purple-400">
      <img
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <div>
      <h2>{state==='signup'?"Create new account":"login to your account"}</h2>
      <p>This is demo para new content will add later ....</p>
      </div>
    </div>
  );
};

export default Login;
