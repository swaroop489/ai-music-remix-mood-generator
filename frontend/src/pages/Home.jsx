import InfoPanel from "../components/InfoPanel";
import PromptGenerator from "../components/MusicGenerator.jsx";
import RemixUploader from "../components/RemixGenerator.jsx";
import HistoryPanel from "../components/HistoryPanel";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("prompt");
  const [history, setHistory] = useState([]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoPanel />

        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${mode === "prompt" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              onClick={() => setMode("prompt")}
            >
              Generate
            </button>
            <button
              className={`px-4 py-2 rounded ${mode === "remix" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              onClick={() => setMode("remix")}
            >
              Remix
            </button>
          </div>

          {mode === "prompt" && <PromptGenerator setHistory={setHistory} />}
          {mode === "remix" && <RemixUploader setHistory={setHistory} />}
        </div>

        <HistoryPanel history={history} />
      </div>
    </div>
  );
}
