"use client";
import useAuth from "../useAuth";
import React from "react";
import {ArrowLongRightIcon} from "@heroicons/react/24/outline";

const UserStatus = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex items-center">
          <button
            onClick={() => logout()}
            className="p-1 text-white font-semibold"
          >
            Logout
          </button>
          <ArrowLongRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => login()}
            className="p-1 text-white font-semibold"
          >
            Login
          </button>
          <ArrowLongRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default UserStatus;
