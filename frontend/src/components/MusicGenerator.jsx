import React, { useState } from "react";

export default function PromptGenerator({ setHistory }) {
  const [prompt, setPrompt] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const moods = ["Happy", "Sad", "Lofi", "Energetic", "Calm"];

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a prompt or select a mood!");
    setLoading(true);
    setAudioSrc("");

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("duration", 5);

      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate music");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);

      setHistory((prev) => [{ type: "prompt", prompt, audioSrc: url }, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Error generating music");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Describe your desired music (e.g., chill guitar, epic soundtrack)..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 mb-4 text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Mood Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setPrompt(m)}
            className={`px-4 py-2 rounded-full text-white font-medium transition ${
              prompt === m ? "opacity-90 scale-105" : ""
            } ${
              m === "Happy"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : m === "Sad"
                ? "bg-blue-500 hover:bg-blue-600"
                : m === "Lofi"
                ? "bg-purple-500 hover:bg-purple-600"
                : m === "Energetic"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition mb-6"
      >
        {loading ? "Generating..." : "Generate Music"}
      </button>

      {audioSrc && (
        <audio controls className="w-full rounded-lg border border-gray-300">
          <source src={audioSrc} type="audio/wav" />
        </audio>
      )}
    </div>
  );
}
