"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next'
import { getCookie } from 'cookies-next';
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    // Check user login status (you may use a more secure method)
    const checkLoginStatus = () => {
      const token = getCookie('token');
      if (token) {
        const userIsLoggedIn = true; // Change this based on your authentication logic
        setIsLoggedIn(userIsLoggedIn);
      }
    };

    checkLoginStatus();
  }, []);
  // useEffect(() => {
  //   // Check user login status (you may use a more secure method)
  //   const checkLoginStatus = () => {
  //     const token = getCookie('token');
  //     if (token) {
  //       const userIsLoggedIn = true; // Change this based on your authentication logic
  //       setIsLoggedIn(userIsLoggedIn);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  const login = () => {
    // setIsLoggedIn(true);
    router.push("/auth/login"); // Redirect to the main page

  };

  const logout = () => {
    deleteCookie('token');
    deleteCookie('user');
    setIsLoggedIn(false);
    router.push("/auth/login"); // Redirect to the login page
  };

  return { isLoggedIn, login, logout };
  
};

export default useAuth;
