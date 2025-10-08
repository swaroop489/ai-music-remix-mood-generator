import React, { useState } from "react";

export default function RemixUploader({ setHistory }) {
  const [file, setFile] = useState(null);
  const [mood, setMood] = useState("");
  const [desc, setDesc] = useState(""); 
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const moods = ["Happy", "Sad", "Lofi", "Energetic", "Calm"];

  const handleGenerate = async () => {
    if (!file || !mood) return alert("Please upload a file and select a mood!");
    if (file.size > 10 * 1024 * 1024) return alert("File too large! Max 10MB.");

    setLoading(true);
    setAudioSrc("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mood", mood);
    formData.append("description", desc);

    try {
      const res = await fetch("http://127.0.0.1:8000/remix", {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);

      // Save to history
      setHistory((prev) => [
        { type: "remix-inspired", mood, description: desc, audioSrc: url },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      alert("Error generating inspired track");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border p-2 rounded-lg mb-4 bg-gray-50"
      />
      {/* Show selected mood & description */}
        {(mood || desc) && (
          <div className="w-full mb-4 p-3 bg-gray-100 rounded-lg text-gray-800">
            {mood && <p><strong>Selected Mood:</strong> {mood}</p>}
            {desc && <p><strong>Description:</strong> {desc}</p>}
          </div>
        )}

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-4 py-2 rounded-full text-white font-medium ${
              mood === m ? "scale-105 opacity-90" : ""
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

      <input
        type="text"
        placeholder="Optional description (e.g., make it jazzy)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-3 rounded-lg border mb-4"
      />

      <button
        onClick={handleGenerate}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold mb-6"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Inspired Track"}
      </button>

      {audioSrc && (
        <audio controls className="w-full rounded-lg border">
          <source src={audioSrc} type="audio/wav" />
        </audio>
      )}
    </div>
  );
}
