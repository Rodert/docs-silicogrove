---
class: api-page
---

# Reference Assets

Upload local images, videos, and audio to the temporary asset endpoint. The returned `data.url` can be placed in a video request's `images`, `videos`, or `audios` array.

::: warning
Temporary assets are deleted after 24 hours. Use your own object storage or CDN URLs for persistent files.
:::

```bash
# Image
curl -X POST "https://ai.silicogrove.com/pg/assets" -H "Authorization: Bearer YOUR_API_KEY" -F "kind=image" -F "file=@/path/to/ref.jpg"

# Video
curl -X POST "https://ai.silicogrove.com/pg/assets" -H "Authorization: Bearer YOUR_API_KEY" -F "kind=video" -F "file=@/path/to/ref.mp4"

# Audio
curl -X POST "https://ai.silicogrove.com/pg/assets" -H "Authorization: Bearer YOUR_API_KEY" -F "kind=audio" -F "file=@/path/to/ref.mp3"
```

## Response example

```json
{"success":true,"data":{"kind":"image","url":"https://file.lunadownload.com/temporary/2026/08/11/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg","filename":"ref.jpg","content_type":"image/jpeg","size":123456}}
```

| `kind` | Formats | Maximum file size |
| --- | --- | --- |
| `image` | jpg, png, webp | 10 MiB |
| `video` | mp4, mov, webm | 100 MiB |
| `audio` | mp3, m4a, wav, aac, ogg, webm | 20 MiB |
