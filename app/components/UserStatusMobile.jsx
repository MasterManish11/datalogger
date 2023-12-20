'use client'
import React from 'react'
import useAuth from "../useAuth";
import {ArrowLongRightIcon} from "@heroicons/react/24/outline";

const UserStatusMobile = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
      {isLoggedIn ? (
        <div className="flex items-center">
          <button
            onClick={() => logout()}
            className="p-1 text-gray-800 font-semibold"
          >
            Logout
          </button>
          <ArrowLongRightIcon className="h-6 w-6 text-gray-800" aria-hidden="true" />
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => login()}
            className="p-1 text-gray-800 font-semibold"
          >
            Login
          </button>
          <ArrowLongRightIcon className="h-6 w-6 text-gray-800" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export default UserStatusMobile
