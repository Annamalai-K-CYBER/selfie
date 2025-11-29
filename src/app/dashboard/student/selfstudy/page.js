"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";
import { Loader2, X, Copy } from "lucide-react";

export default function SelfStudyPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]); // { question, response, timestamp }
  const [loading, setLoading] = useState(false);

  // Ensure user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
  }, [router]);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);

    const newEntry = { question, response: "", timestamp: new Date() };
    setHistory([newEntry, ...history]);
    setQuestion("");

    try {
      // Replace this with actual API call to your AI backend
      const res = await fetch("/api/selfstudy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const updatedHistory = history.map((h, idx) =>
        idx === 0 ? { ...newEntry, response: data.response || "No response" } : h
      );

      setHistory([ { ...newEntry, response: data.response || "No response" }, ...history ]);
    } catch (err) {
      console.error(err);
      setHistory([ { ...newEntry, response: "❌ Error: Could not get response." }, ...history ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => setHistory([]);
  const copyResponse = (text) => navigator.clipboard.writeText(text);

  return (
    <div>
      <StudentNavbar />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🤖 Self Study Helper</h2>

        <textarea
          placeholder="Ask anything…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-3 rounded-xl h-32 mb-4 resize-none focus:ring-2 focus:ring-yellow-300"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="w-full bg-yellow-400 py-3 rounded-xl font-bold hover:bg-yellow-300 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Ask AI"}
        </button>

        {history.length > 0 && (
          <div className="mt-6 flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">History</h3>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-red-500 hover:text-red-700"
            >
              <X size={16} /> Clear
            </button>
          </div>
        )}

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {history.map((h, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl shadow border-l-4 border-yellow-400">
              <div className="mb-2 text-gray-700">
                <strong>Q:</strong> {h.question}
              </div>
              <div className="text-gray-800 flex justify-between items-start gap-2">
                <span><strong>A:</strong> {h.response}</span>
                <button
                  onClick={() => copyResponse(h.response)}
                  className="text-gray-500 hover:text-gray-800"
                  title="Copy response"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(h.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
