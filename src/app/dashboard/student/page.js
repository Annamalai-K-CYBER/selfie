"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------
    STUDENT DASHBOARD PAGE
------------------------------------------------------------------- */

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // 🔐 Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, <span className="text-yellow-600">{user.username}</span> 👋
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StudyPlanGenerator />
        <SelfStudyHelper />
        <DailyTaskView />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
    STUDY PLAN GENERATOR
------------------------------------------------------------------- */

function StudyPlanGenerator() {
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);

    // Placeholder AI output — later you connect your API
    setTimeout(() => {
      setPlan({
        steps: [
          `Study basics of ${subject}`,
          `Complete 20 MCQs daily`,
          `Revise previous year questions`,
          `Daily 1-hour focused revision`,
        ],
        goal,
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <Card title="📘 Study Plan Generator">
      <div className="space-y-3">
        <input
          placeholder="Subject (e.g., DBMS)"
          className="w-full p-2 border rounded-lg"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          placeholder="Goal (e.g., mid-term exam)"
          className="w-full p-2 border rounded-lg"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button
          onClick={generatePlan}
          disabled={loading || !subject || !goal}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-xl"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        {plan && (
          <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
            <h3 className="font-semibold text-lg mb-2">📅 Your Plan</h3>
            <p className="text-gray-600 mb-2">🎯 Goal: {plan.goal}</p>
            <ul className="list-disc ml-5 text-gray-700">
              {plan.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------
    SELF STUDY HELPER (Timer + Pomodoro + Notes)
------------------------------------------------------------------- */

function SelfStudyHelper() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState("");

  // Timer logic
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Card title="⏳ Self-Study Helper">
      <div className="space-y-3">
        {/* Timer */}
        <p className="text-3xl font-bold text-center">{formatTime(seconds)}</p>

        <div className="flex justify-center gap-3">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-lg"
            onClick={() => setRunning(!running)}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg"
            onClick={() => {
              setSeconds(0);
              setRunning(false);
            }}
          >
            Reset
          </button>
        </div>

        {/* Notes */}
        <textarea
          placeholder="Quick Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded-xl h-24"
        />

        <p className="text-xs text-gray-500 text-center">
          Notes are stored locally (not uploaded)
        </p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------
    DAILY TASK VIEW
------------------------------------------------------------------- */

function DailyTaskView() {
  const [tasks, setTasks] = useState([
    { task: "Read 10 pages of OS", done: false },
    { task: "Solve 20 DBMS MCQs", done: false },
    { task: "Revise DSA Notes", done: false },
  ]);

  const toggleTask = (i) => {
    const updated = [...tasks];
    updated[i].done = !updated[i].done;
    setTasks(updated);
  };

  return (
    <Card title="📝 Today's Tasks">
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
          >
            <span className={t.done ? "line-through text-gray-400" : ""}>
              {t.task}
            </span>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(i)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ------------------------------------------------------------------
    UI CARD COMPONENT
------------------------------------------------------------------- */

function Card({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
