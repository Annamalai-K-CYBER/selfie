"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // ✅ correct named import

export default function StudentNavbar() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Student");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // decode token
        if (decoded?.name) setName(decoded.name);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <nav className="bg-yellow-400 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-white">{name}'s Dashboard</h1>

      <button className="md:hidden text-2xl text-white" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div
        className={`${
          open ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-4 md:gap-6 absolute md:static top-16 left-0 right-0 bg-yellow-400 md:bg-transparent p-4 md:p-0`}
      >
        <Link href="/dashboard/student" className="text-white hover:underline">
          Home
        </Link>
        <Link href="/dashboard/student/studygenerator" className="text-white hover:underline">
          Study Generator
        </Link>
        <Link href="/dashboard/student/selfstudy" className="text-white hover:underline">
          Self Study Helper
        </Link>
        <Link href="/dashboard/student/tasks" className="text-white hover:underline">
          Today's Tasks
        </Link>
        <button
          onClick={logout}
          className="bg-white text-yellow-500 px-4 py-1 rounded font-semibold hover:bg-gray-100 mt-2 md:mt-0"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
