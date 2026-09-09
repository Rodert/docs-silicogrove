---
class: api-page
---

# Video

Video generation is asynchronous. Submit to `POST /v1/videos`, retain the returned task ID, then poll `GET /v1/videos/{task_id}` until the task reaches a terminal state. Video models must not be sent to `/v1/chat/completions`.

Available models depend on the API key and group. Call `GET /v1/models` before presenting model choices to end users.

## Recommended model: Grok Video 1.5

| Model | Duration | Resolution |
| --- | --- | --- |
| `grok-video-1.5` | `6`, `8`, `10`, `12`, or `15` seconds | Check the model response |

::: warning
For `grok-video-1.5`, `seconds` must be the string `"6"`, `"8"`, `"10"`, `"12"`, or `"15"`. Sending `"4"` or any other value returns: `seconds must be one of: 6, 8, 10, 12, 15`.
:::

## Other supported Kling V3 models

| Model | Duration | Resolution | Billing |
| --- | --- | --- | --- |
| `kling-video-v3` | 3-15 seconds | `720p`, `1080p`, `4k` | Per second and selected resolution |
| `kling-video-v3-omni` | 3-15 seconds | `720p`, `1080p`, `4k` | Per second and selected resolution |
| `kling-video-v3-turbo` | 3-15 seconds | `720p`, `1080p` | Per second and selected resolution |

Send `resolution` as a top-level field in Kling create requests. Do not use the image-generation `quality` field for video resolution. The effective price is determined when the task is submitted, so do not rely on a fixed documented amount.

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

This example uses the recommended `grok-video-1.5` model to create a 15-second text-to-video task. A successful create request returns an asynchronous task. Store `task_id`, then use [Poll a task](#poll-a-task) to retrieve progress and output.

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "task_id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "object": "video.generation",
  "model": "grok-video-1.5",
  "status": "queued",
  "progress": 0,
  "created_at": 1786869597,
  "result": {}
}
```

## Reference assets

Use public HTTPS URLs or complete `data:` URLs such as `data:image/png;base64,...`. Do not send a local file path or bare base64 bytes. Local files can be uploaded through [Reference assets](/api/assets) first.

`image_urls` is the preferred field. `images` is accepted for compatibility. Send only one of them. `reference_images` and `input_reference: {"image_url":"..."}` are also accepted for integrations that use those names; do not combine `reference_images` and `input_reference` in one request.

## Request fields

| Field | Required | Description |
| --- | --- | --- |
| `model` | Yes | A video model available to the API key. |
| `prompt` | Yes | Describe the subject, motion, camera, visual style, and composition. |
| `seconds` | No | Requested duration as a string, for example `"6"`, `"8"`, `"10"`, or `"15"`. Model-specific limits apply. `grok-video-1.5` accepts only `"6"`, `"8"`, `"10"`, `"12"`, or `"15"`. |
| `aspect_ratio` | No | `16:9`, `9:16`, or `1:1`. |
| `resolution` | Required for Kling V3 | `480p`, `720p`, `1080p`, or `4k`, subject to the selected model. Send it as a top-level field; do not use `quality` as a replacement. |
| `image_urls` | No | Preferred array of up to 7 reference image URLs or complete data URLs. |
| `images` | No | Compatibility alias for `image_urls`; do not send both. |
| `image` | No | `grok-imagine-video-1.5` first-frame mode only. A single image URL or complete data URL. Do not combine with `reference_images`. |
| `reference_images` | No | Compatibility array of reference images; do not combine with `input_reference`. |
| `input_reference` | No | Compatibility single-image form: `{ "image_url": "https://..." }`. |

The older `video-ds-*` models support `images`, `videos`, and `audios`. Their media limits are 4 images, 3 videos, and 1 audio file.

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

## Security and reliability recommendations

### API keys and callers

- Store API keys only in server-side environment variables or a secrets manager. Browsers, mobile apps, and public frontend code must not hold long-lived keys.
- Use separate API keys per application or purpose. A compromised key can then be revoked without interrupting unrelated workloads.
- After creating a task, persist both your local business identifier and the returned `task_id` for polling, reconciliation, and retry control.

### Reference assets and downloads

- Reference URLs must be safely reachable by the video service. Do not provide private-network IP addresses, administrative endpoints, cloud credential URLs, or local file paths.
- After completion, download videos through the authenticated `/content` endpoint rather than exposing temporary result URLs long term.
- Create a replacement task only after the existing task explicitly returns `failed`. Continue polling the same `task_id` while it is `queued` or `in_progress` to prevent duplicate generations and charges.

## Grok Imagine models (currently unavailable)

::: warning
`grok-imagine-video` and `grok-imagine-video-1.5` are currently unavailable and must not be used for production requests. This section is retained as a historical parameter reference; use the active Kling models above.
:::

| Model | Generation modes | Duration | Resolution |
| --- | --- | --- | --- |
| `grok-imagine-video` | Text to video | Model-dependent | Model-dependent |
| `grok-imagine-video-1.5` | Text to video, first-frame image to video, reference-image video | `4`, `6`, `8`, `10`, `12`, or `15` seconds | Text and first-frame: `480p`, `720p`, `1080p`; reference images: up to `720p` |

`grok-imagine-video-1.5` has two mutually exclusive image modes: first-frame mode accepts one `image` URL; reference-image mode accepts 1-7 `reference_images` URLs and uses `<IMAGE_1>`, `<IMAGE_2>`, and similar placeholders in the prompt. Do not send `image`, `images`, `image_urls`, or `input_reference` with `reference_images`. Reference-image mode is limited to `720p`.

Historical request example:

```json
{
  "model": "grok-imagine-video-1.5",
  "prompt": "The person from <IMAGE_1> walks through a city street in a cinematic commercial shot",
  "reference_images": ["https://example.com/person.jpg"],
  "seconds": "8",
  "aspect_ratio": "16:9",
  "resolution": "720p"
}
```
