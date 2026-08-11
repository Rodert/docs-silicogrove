---
class: api-page
---

# 音频

## 语音合成

```bash
curl -X POST "https://ai.silicogrove.com/v1/audio/speech" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "YOUR_TTS_MODEL",
    "input": "欢迎使用 Silico Grove API。",
    "voice": "alloy",
    "response_format": "mp3"
  }' \
  --output speech.mp3
```

## 音频转写与翻译

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

转写和翻译必须使用 multipart，文件字段名为 `file`。
