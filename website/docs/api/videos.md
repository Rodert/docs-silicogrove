---
class: api-page
---

# Video

Video generation is asynchronous. Submit to `POST /v1/videos`, retain the returned task ID, then poll `GET /v1/videos/{task_id}` until the task reaches a terminal state. Video models must not be sent to `/v1/chat/completions`.

Available models depend on the API key and group. Call `GET /v1/models` before presenting model choices to end users.

## Supported Grok video models

| Model | Text to video | Reference images | Maximum duration | Resolution |
| --- | --- | --- | --- | --- |
| `grok-image-video` | Yes | 1 image: up to 15s; 2-7 images: up to 10s | 15s | `480p`, `720p` |
| `grok-video-1.5` | Yes | 0-7 images | 15s | `480p`, `720p` |

For `grok-video-1.5`, `seconds` must be one of `"4"`, `"6"`, `"8"`, `"10"`, `"12"`, or `"15"`. Other values return `seconds must be one of: 4, 6, 8, 10, 12, 15`.

For `grok-image-video`, multi-reference requests above 10 seconds are processed as 10-second requests. Always use the actual task result as the final source of truth.

## Supported Kling V3 models

| Model | Duration | Resolution | Billing |
| --- | --- | --- | --- |
| `kling-video-v3` | 3-15 seconds | `720p`, `1080p`, `4k` | Per second and selected resolution |
| `kling-video-v3-omni` | 3-15 seconds | `720p`, `1080p`, `4k` | Per second and selected resolution |
| `kling-video-v3-turbo` | 3-15 seconds | `720p`, `1080p` | Per second and selected resolution |

Send `resolution` as a top-level field in the create request. Do not use the image-generation `quality` field for video resolution. The effective price is determined when the task is submitted, so do not rely on a fixed documented amount.

## Create a task

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-video-1.5",
    "prompt": "A cinematic sunrise over a futuristic coastal city, slow aerial camera movement",
    "seconds": "15",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

The response includes a public `id` or `task_id`. Store that value; do not use an upstream task ID obtained from another API response.

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "object": "video",
  "status": "queued"
}
```

### Kling V3 example

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kling-video-v3",
    "prompt": "A cinematic sunrise over a futuristic coastal city, slow aerial camera movement",
    "seconds": "15",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

## Create a reference-image task

Use public HTTPS URLs or complete `data:` URLs such as `data:image/png;base64,...`. Do not send a local file path or bare base64 bytes. Local files can be uploaded through [Reference assets](/api/assets) first.

`image_urls` is the preferred field. `images` is accepted for compatibility. Send only one of them. `reference_images` and `input_reference: {"image_url":"..."}` are also accepted for integrations that use those names; do not combine `reference_images` and `input_reference` in one request.

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-video-1.5",
    "prompt": "Create a premium product showcase with soft studio lighting and a slow rotating camera",
    "seconds": "10",
    "aspect_ratio": "9:16",
    "resolution": "720p",
    "image_urls": [
      "https://example.com/product-front.png",
      "https://example.com/product-side.png"
    ]
  }'
```

## Request fields

| Field | Required | Description |
| --- | --- | --- |
| `model` | Yes | A video model available to the API key. |
| `prompt` | Yes | Describe the subject, motion, camera, visual style, and composition. |
| `seconds` | No | Requested duration as a string, for example `"4"`, `"6"`, `"10"`, or `"15"`. Model-specific limits apply. |
| `aspect_ratio` | No | `16:9`, `9:16`, or `1:1`. |
| `resolution` | No | `480p`, `720p`, `1080p`, or `4k`, subject to the selected model. Send it as a top-level field; do not use `quality` as a replacement. |
| `image_urls` | No | Preferred array of up to 7 reference image URLs or complete data URLs. |
| `images` | No | Compatibility alias for `image_urls`; do not send both. |
| `reference_images` | No | Compatibility array of reference images; do not combine with `input_reference`. |
| `input_reference` | No | Compatibility single-image form: `{ "image_url": "https://..." }`. |

The older `video-ds-*` models support `images`, `videos`, and `audios`. Their media limits are 4 images, 3 videos, and 1 audio file. Do not send video or audio references to the Grok models.

## Poll a task

```bash
curl -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Treat `queued` and `in_progress` as non-terminal. `completed` means the video is available; `failed` means generation ended unsuccessfully. Poll no more frequently than once every 5 seconds, and retain the task ID if a client-side timeout is reached.

## Download the completed video

```bash
curl -L "https://ai.silicogrove.com/v1/videos/TASK_ID/content" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  --output result.mp4
```

The service may return a signed result URL internally. It is temporary and should be downloaded promptly. Use the content endpoint above rather than reconstructing an upstream URL, task ID, domain, or signature.
