import React from "react";

export default function HistoryPanel({ history }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md overflow-y-auto max-h-[80vh]">
      <h2 className="text-xl font-semibold mb-4">🎧 Recent Tracks</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No tracks yet. Generate or remix music!</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <p className="text-gray-700 mb-2">
              {item.type === "prompt"
                ? `Prompt: "${item.prompt}"`
                : `Remix Mood: "${item.mood}"`}
            </p>

            {/* Audio Player */}
            <audio
              controls
              src={item.audioSrc}
              className="w-full rounded-lg border border-gray-300 mb-2"
            ></audio>

            {/* Download Button */}
            {item.audioSrc && (
              <a
                href={item.audioSrc}
                download={
                  item.type === "prompt"
                    ? `generated_music_${index + 1}.wav`
                    : `remix_music_${index + 1}.wav`
                }
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded font-medium transition"
              >
                Download
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
