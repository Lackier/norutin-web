import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    async function performLogout() {
      try {
        await logout();
      } catch (error) {
        console.log('Error ' + error)
      }
    }

    performLogout();
  }, []);

  return (<div></div>);
}
