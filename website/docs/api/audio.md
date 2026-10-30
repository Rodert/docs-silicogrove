---
class: api-page
---

# Audio

<p class="api-section-description">Use the audio APIs to turn text into speech or transcribe recordings into text.</p>

## Speech synthesis

```bash
curl -X POST "https://ai.silicogrove.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"YOUR_TTS_MODEL","input":"Welcome to Silico Grove API.","voice":"alloy","response_format":"mp3"}' \
  --output speech.mp3
```

## Transcription and translation

```bash
curl -X POST "https://ai.silicogrove.com/v1/audio/transcriptions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=YOUR_STT_MODEL" \
  -F "file=@/path/to/audio.mp3" \
  -F "response_format=json"

curl -X POST "https://ai.silicogrove.com/v1/audio/translations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=YOUR_STT_MODEL" \
  -F "file=@/path/to/audio.mp3" \
  -F "response_format=json"
```

Transcription and translation are multipart requests. The file field is `file`.
