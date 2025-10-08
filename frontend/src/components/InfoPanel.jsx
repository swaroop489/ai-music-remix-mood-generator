export default function InfoPanel() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">💡 Tips & Model Info</h2>
      <p className="text-gray-600 mb-2">Model: <b>facebook/musicgen-small</b></p>
      <p className="text-gray-600 mb-4"> For Remix Audio Input Upload Limit: 10 MB</p>
      <h3 className="text-lg font-semibold mb-2">🎶 Example Prompts For Mood Generation:</h3>
      <ul className="text-gray-600 list-disc list-inside space-y-1">
        <li>“Happy upbeat pop with drums and guitar”</li>
        <li>“Cinematic emotional orchestral soundtrack”</li>
        <li>“Lo-fi chill piano beat with rain ambience”</li>
      </ul>
      <h3 className="text-lg font-semibold mb-2 mt-4">🎶 For Remix Generation:</h3>
      <ul className="text-gray-600 list-disc list-inside space-y-1">
        <li>Download the audio file from the history panel that you created. (WAV/MP3) File.</li>
        <li>Select Mood for remix</li>
        <li>Provide Optional description, model will generate remix for the song provided.</li>
      </ul>
    </div>
  );
}
