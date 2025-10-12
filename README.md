
# AI Music Remix & Mood Generator


### Problem Statement
The process of creating or remixing music often demands technical expertise, specialized software, and a deep understanding of music production—skills that many students and aspiring creators may not possess. As a result, their ability to experiment with sound, express emotions, and explore creativity through music becomes limited. With the growing influence of AI in creative fields, there is an opportunity to make music generation more accessible and enjoyable for everyone, regardless of technical skill level.

**Problem:** There is a need for an intelligent, user-friendly platform that uses AI to generate music and remixes based on user-selected moods or genres, empowering individuals to create and explore musical expression effortlessly.

---

## Architecture
- **Frontend:** React-based web app for user interaction (prompt input, file upload, mood selection, and audio playback).  
- **Backend:** FastAPI server handling requests, model execution, and audio file responses.  
- **Model Engine:** Meta’s MusicGen (facebook/musicgen-small) for AI-driven music and remix generation.  
- **Data Handling:** Temporary file storage, waveform normalization, and WAV generation using NumPy and SciPy.

---

## Algorithm 
- The system accepts a **text prompt** or **uploaded audio** as input.
- Inputs are converted into a generation prompt for the MusicGen model (mood, description, or upload-informed prompt).
- MusicGen generates raw **audio waveforms** which are normalized and saved as **WAV** files.
- Frontend receives the WAV and provides playback and history features.

---

## Deployment 
- Model size: **> 2 GB** and requires a **GPU-enabled environment** for smooth execution.  
- Many free hosting platforms (Render, Vercel, Hugging Face Spaces) cannot host this due to memory/compute limits.  
- Executed locally for testing and demonstration.  
- A **demo video** of the full system has been recorded and uploaded to Google Drive for evaluation.
- "Model size is >2 GB and requires GPU resources; cloud-free-hosting platforms were insufficient. Full demo recorded locally — video uploaded to Google Drive."

### **NOTE : The model takes 1-1.13 minutes to generate audio so in video Timestamps to view output are 1:49 3:20 and 5:28**

###  **Google Drive Link of Video :** https://drive.google.com/file/d/1dJR70PTZ5vFPmwBogk_Q_MnAIxC9grb7/view?usp=sharing

---

## Data Handling & Audio Processing 
- Generated tensor → NumPy → normalize → PCM16 → WAV using `scipy.io.wavfile`.  
- Uploaded files handled via FastAPI `UploadFile`.  
- Temporary files created via `tempfile` and cleaned up after errors.  
- Optional MP3→WAV conversion using `pydub.AudioSegment`.

---

## Frontend (React) — Key Features
- `PromptGenerator.jsx`: Enter text prompts or pick moods to generate music.
- `RemixUploader.jsx`: Upload an audio file, select mood and description to generate a mood-inspired remix.
- Uses `fetch` to POST `FormData` to `/generate` and `/remix` endpoints.
- Displays audio playback and saves generation history locally.

---

## Backend (FastAPI) — Key Features
- Endpoints:
  - `POST /generate` — generate music from text prompt and duration.
  - `POST /remix` — accept an uploaded audio file, mood, and description to produce an inspired remix.
- Uses `audiocraft.models.MusicGen` (pretrained `facebook/musicgen-small`) for inference.
- Handles CORS, validation, temporary files, and returns `FileResponse` for the WAV files.

---


## Future Scope
- Quantize/Prune or distill the model for lightweight deployment (edge or mobile).  
- Add a cloud GPU inference pipeline with batching and autoscaling (pay-as-you-go).  
- Add user accounts, playlists, and export options (MP3/OGG).  
- Add more fine-grained mood/genre controls and longer duration generation.

---
