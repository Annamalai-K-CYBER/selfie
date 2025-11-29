"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in → go to login
    if (!token || !role) {
      router.replace("/");
      return;
    }

    // Redirect based on role
    switch (role) {
      case "student":
        router.replace("/dashboard/student");
        break;
      case "mentor":
        router.replace("/dashboard/mentor");
        break;
      case "admin":
        router.replace("/dashboard/admin");
        break;
      default:
        router.replace("/");
        break;
    }
  }, [router]);

  return <div className="p-10 text-center">Redirecting...</div>;
}
