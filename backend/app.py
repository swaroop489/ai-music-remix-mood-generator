import os
import tempfile
import traceback
import base64

import torch
import numpy as np
import scipy.io.wavfile as wavfile
from fastapi import FastAPI, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write

# Optional: For MP3 to WAV conversion
from pydub import AudioSegment

# ----------------- FastAPI Setup -----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Load Model -----------------
model = MusicGen.get_pretrained("facebook/musicgen-small")
print("MusicGen model loaded!")

# ----------------- Generate Music -----------------
@app.post("/generate")
async def generate_music(prompt: str = Form(...), duration: int = Form(5)):
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    duration = min(int(duration), 5)  # Safety: max 5s

    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    output_path = tmp_file.name
    tmp_file.close()

    try:
        print(f"Generating music for prompt: '{prompt}', duration: {duration}s")

        with torch.no_grad():
            model.set_generation_params(duration=duration)
            generated = model.generate([prompt])

        # Normalize return value to a list of tensors
        if isinstance(generated, torch.Tensor):
            waveform_list = [generated]
        elif isinstance(generated, (list, tuple)):
            waveform_list = list(generated)
        else:
            raise Exception(f"Unexpected return type from model.generate(): {type(generated)}")

        if len(waveform_list) == 0:
            raise Exception("model.generate returned no samples")

        waveform = waveform_list[0]

        # If tensor has batch dim [batch, channels, length] take first batch
        if waveform.ndim == 3:
            waveform = waveform[0]
        elif waveform.ndim == 1:
            waveform = waveform.unsqueeze(0)
        waveform = waveform.cpu().float()

        # Convert tensor to numpy
        np_wave = waveform.numpy()
        if np_wave.ndim == 2:
            np_wave = np_wave.T  # (length, channels)

        # Normalize
        max_abs = np.max(np.abs(np_wave)) if np_wave.size > 0 else 0.0
        if max_abs > 1.0:
            np_wave = np_wave / max_abs

        pcm16 = (np_wave * 32767).astype(np.int16)
        wavfile.write(output_path, model.sample_rate, pcm16)

        return FileResponse(output_path, media_type="audio/wav", filename="generated.wav")

    except Exception as e:
        traceback.print_exc()
        try:
            if os.path.exists(output_path):
                os.remove(output_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=str(e))


# ----------------- Remix Music -----------------
@app.post("/remix")
async def remix_inspired(file: UploadFile, mood: str = Form(...), description: str = Form("")):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")
    
    # Create a prompt based on mood + optional description
    prompt_text = f"Generate a {mood.lower()} music track inspired by uploaded song."
    if description:
        prompt_text += f" {description}"

    # Save uploaded file temporarily (optional, for reference)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    tmp_file.write(await file.read())
    tmp_file.close()

    # Generate music
    tmp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    tmp_output.close()
    try:
        with torch.no_grad():
            model.set_generation_params(duration=5)  # fixed 5s
            generated = model.generate([prompt_text])[0]

        if generated.ndim == 3:  # batch, channels, length
            generated = generated[0]
        waveform = generated.cpu().numpy()
        if waveform.ndim == 2:
            waveform = waveform.T

        # Normalize and save
        max_abs = np.max(np.abs(waveform)) or 1.0
        waveform = waveform / max_abs
        pcm16 = (waveform * 32767).astype(np.int16)
        wavfile.write(tmp_output.name, model.sample_rate, pcm16)

        return FileResponse(tmp_output.name, media_type="audio/wav", filename="inspired.wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



























