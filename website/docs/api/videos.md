---
class: api-page
---

# Video

Video models must use `POST /v1/videos`, not `/v1/chat/completions`. Submissions return a task ID that must be polled.

## Minimal text-to-video request

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"video-ds-2.0-fast","prompt":"A cinematic 9:16 short video, neon city rooftop at night, realistic lighting, no watermark.","seconds":"15","aspect_ratio":"9:16"}'
```

## Reference media

Reference media must use public URLs. Upload local files through [Reference assets](/api/assets); do not place local paths in JSON.

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"video-ds-2.0","prompt":"Use the image appearance and video motion to create a natural 9:16 video.","seconds":"15","aspect_ratio":"9:16","images":["https://example.com/ref-1.jpg"],"videos":["https://example.com/motion.mp4"],"audios":["https://example.com/music.mp3"]}'
```

| Field | Limit | Description |
| --- | --- | --- |
| `model` | Required | A video model visible to the API key. |
| `prompt` | Required | Describe the subject, motion, camera, style, and ratio. |
| `seconds` | Recommended | String: `"5"`, `"10"`, or `"15"`. |
| `aspect_ratio` | Recommended | `16:9`, `9:16`, or `1:1`. |
| `images` | Up to 4 | Array of jpg, png, or webp URLs. |
| `videos` | Up to 3 | Array of mp4, mov, or webm URLs. |
| `audios` | Up to 1 | Array of mp3, m4a, wav, aac, or ogg URLs. |

These limits apply to `video-ds-2.0`, `video-ds-2.0-fast`, and `as-sd2.0-fast`. Other video models may differ.

## Retrieve a task and download its result

```bash
curl -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl -L -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID/content" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  --output result.mp4
```
