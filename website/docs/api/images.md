---
class: api-page
---

# Images

List models with your API key before use; its `GET /v1/models` response is the source of truth.

```bash
curl "https://ai.silicogrove.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

| Model | Generate | Edit | OpenAI image API | Native Gemini API |
| --- | --- | --- | --- | --- |
| `gpt-image-2` | Yes | Yes | Yes | No |
| `gpt-image-2-all` | Depends on visibility in `/v1/models` | Depends on upstream | Yes | No |
| `gemini-3-pro-image` | Yes | Yes | Yes | Yes |
| `gemini-3.1-flash-image` | Yes | Yes | Yes | Yes |
| `gemini-3-pro-image-preview` | Yes | Yes | Yes | Yes |
| `gemini-3.1-flash-image-preview` | Yes | Yes | Yes | Yes |
| `gemini-2.5-flash-image` | Yes | Yes | Yes | Yes |
| `grok-imagine-image`, `grok-imagine-image-pro` | Depends on visibility in `/v1/models` | Depends on upstream | Yes | No |

Use `https://ai.silicogrove.com` as the primary Base URL and `https://api.silicogrove.com` as an explicit backup. All requests use `Authorization: Bearer YOUR_API_KEY`.

## OpenAI-compatible generation

This interface works with `gpt-image-2` and Gemini image models.

```bash
curl "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A premium product poster, realistic photography, clean background",
    "size": "1024x1024",
    "quality": "high",
    "n": 1,
    "response_format": "url"
  }'
```

Gemini model example:

```bash
curl "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image",
    "prompt": "A 16:9 neon city in the rain at night",
    "size": "1792x1024",
    "quality": "2k",
    "n": 1,
    "response_format": "url"
  }'
```

## OpenAI-compatible editing

Use multipart form data. Do not set `Content-Type` manually; curl or your SDK must generate the multipart boundary.

```bash
curl "https://ai.silicogrove.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=Keep the subject and change the background to a city at night" \
  -F "image=@/path/to/input.png" \
  -F "size=1024x1024" \
  -F "quality=high" \
  -F "n=1"
```

For Gemini, change `model` to `gemini-3.1-flash-image` and use `quality=2k`.

Supported input formats are PNG, JPG, JPEG, and WebP. The playground currently accepts one reference image per request, up to 10 MB.

## OpenAI image parameters

The gateway accepts the common fields below. Individual models may support only a subset; an upstream may ignore or reject unsupported values. Treat `/v1/models` and the model's actual response as authoritative.

| Field | Type | Required | Common values or limits | Description |
| --- | --- | --- | --- | --- |
| `model` | string | Yes | From `GET /v1/models` | Image model name. |
| `prompt` | string | Yes | Natural-language text | Generation or editing instruction. |
| `n` | integer | No | `1` to `128`; default `1` | Number of images. Gemini image models require `1`; other models may impose lower limits. |
| `size` | string | No | Common: `1024x1024`, `1536x1024`, `1024x1536`, `1792x1024`, `1024x1792` | Size or aspect-ratio mapping is model-dependent. DALL-E models enforce narrower enums. |
| `quality` | string | No | Common: `auto`, `low`, `medium`, `high`, `standard`, `hd`, `1k`, `2k`, `4k` | Quality or output-resolution tier. Upstream case sensitivity may differ. |
| `response_format` | string | No | `url`, `b64_json` | Desired synchronous response. Async tasks always return a persisted URL. |
| `background` | string | No | `auto`, `opaque`, `transparent` | Background mode; model-dependent. |
| `output_format` | string | No | `png`, `jpeg`, `webp` | Output file format; model-dependent. |
| `output_compression` | integer | No | Usually `0` to `100` | JPEG/WebP compression quality; model-dependent. |
| `style` | string | No | Common: `vivid`, `natural` | Style option; model-dependent. |
| `moderation` | string | No | Common: `auto`, `low` | Moderation level; model-dependent. |
| `stream` | boolean | No | `true`, `false` | Requests a streamed synchronous response. Async tasks require `false` or omission. |
| `image`, `image[]` | file or model-supported JSON URL/value | For editing | PNG, JPEG, WebP; multipart file limit `10 MB` | Reference image. Async multipart files are persisted before worker execution. |
| `mask` | file or model-supported JSON URL/value | No | Usually PNG | Edit mask; model-dependent. |
| `input_fidelity` | string | No | Common: `low`, `high` | Reference-image fidelity; model-dependent. |

With `curl -F`, do not set `Content-Type` manually. Send scalar multipart values such as `n` and `output_compression` as text form fields.

## OpenAI-compatible response

When R2 upload succeeds, a URL is returned:

```json
{"created":1786192453,"data":[{"url":"https://file.lunadownload.com/temporary/2026/08/12/uuid.png"}]}
```

If R2 is not configured or upload fails, the response contains `b64_json` instead:

```json
{"created":1786192453,"data":[{"b64_json":"iVBORw0KGgo..."}]}
```

| Field | Type | Description |
| --- | --- | --- |
| `created` | integer | Image creation timestamp returned by the provider. |
| `data` | array | Image result list. |
| `data[].url` | string | R2 or provider image URL. The URL may be periodically removed. |
| `data[].b64_json` | string | Base64 image, normally present only for synchronous requests when R2 rewriting is unavailable. |
| `data[].revised_prompt` | string | Provider-revised prompt; returned only by some models. |

::: warning Temporary image URLs
Images returned through `file.lunadownload.com` are temporary and periodically removed. Download and store generated files promptly.
:::

## Asynchronous image tasks

Use the asynchronous API when generation may exceed client or reverse-proxy timeouts. Submission immediately returns a task ID; a background worker calls the provider and persists the result to R2. Existing synchronous endpoints remain unchanged.

| Operation | Endpoint | Request format |
| --- | --- | --- |
| Async generation | `POST /v1/images/tasks` | JSON without `image`, `images`, or `mask` |
| Async editing | `POST /v1/images/tasks` | Multipart file upload, or JSON containing image fields |
| Retrieve task | `GET /v1/images/tasks/{task_id}` | GET |

R2 storage must be enabled for async tasks, and `stream: true` is unsupported. Multipart reference images are limited to `10 MB` each. A task becomes `completed` only after its output is persisted to R2. Provider or storage failures mark it `failed` and refund the pre-consumed quota.

### Async generation

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/tasks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A premium product poster in a realistic photography style",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }'
```

### Async editing

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/tasks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=Keep the subject and change the background to a city at night" \
  -F "image=@/path/to/input.png" \
  -F "size=1024x1024" \
  -F "quality=high" \
  -F "n=1"
```

### Submission response

A successful submission returns HTTP `202 Accepted`:

```json
{
  "id": "task_0123456789abcdef",
  "object": "image.task",
  "status": "queued",
  "progress": "0%",
  "created_at": 1786192453,
  "started_at": 0,
  "completed_at": 0
}
```

### Retrieve and poll

```bash
curl "https://ai.silicogrove.com/v1/images/tasks/task_0123456789abcdef" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Only the user who created a task can retrieve it. Poll every `2` to `5` seconds; avoid high-frequency concurrent polling.

| Field | Type | Present when | Description |
| --- | --- | --- | --- |
| `id` | string | Always | Public task ID in `task_...` format. |
| `object` | string | Always | Always `image.task`. |
| `status` | string | Always | `queued`, `processing`, `completed`, or `failed`. |
| `progress` | string | Always | Percentage string such as `0%`, `10%`, or `100%`. |
| `created_at` | integer | Always | Task submission Unix timestamp. |
| `started_at` | integer | Always | Execution start Unix timestamp, or `0` before execution. |
| `completed_at` | integer | Always | Terminal Unix timestamp, or `0` before completion. |
| `created` | integer | Success | Creation timestamp from the image result. |
| `data` | array | Success | Image results; read the output from `data[].url`. |
| `error.message` | string | Failure | Task failure reason. |
| `error.type` | string | Failure | Currently `image_task_failed`. |

| `status` | Meaning | Terminal |
| --- | --- | --- |
| `queued` | Waiting for a worker | No |
| `processing` | Calling the provider or storing output | No |
| `completed` | Finished; `data[].url` is available | Yes |
| `failed` | Failed; inspect `error` | Yes |

Completed response:

```json
{
  "id": "task_0123456789abcdef",
  "object": "image.task",
  "status": "completed",
  "progress": "100%",
  "created_at": 1786192453,
  "started_at": 1786192455,
  "completed_at": 1786192550,
  "created": 1786192548,
  "data": [{"url": "https://file.lunadownload.com/temporary/2026/08/12/uuid.png"}]
}
```

Failed response:

```json
{
  "id": "task_0123456789abcdef",
  "object": "image.task",
  "status": "failed",
  "progress": "100%",
  "created_at": 1786192453,
  "started_at": 1786192455,
  "completed_at": 1786192550,
  "error": {"message": "upstream request failed", "type": "image_task_failed"}
}
```

### Async HTTP status codes

| Status | Scenario |
| --- | --- |
| `202` | Task created. |
| `400` | Invalid parameters, multipart file, `n`, or `stream`. |
| `403` | API key, quota, group, or model access denied. |
| `404` | Task is absent, has a different type, or belongs to another user. |
| `429` | Request or model concurrency limit reached. |
| `503` | R2 storage required by async tasks is not configured or available. |

Submission or retrieval failures that occur before a task response use this error envelope:

```json
{
  "error": {
    "message": "R2 storage is required for asynchronous image tasks",
    "type": "storage_unavailable",
    "code": "storage_unavailable"
  }
}
```

There is currently no `/v1/images/tasks/{task_id}/content` endpoint. Download `data[].url` from the completed response directly.

## Native Gemini generation

This interface is only for Gemini image models. `gpt-image-2` does not support it.

```bash
curl "https://ai.silicogrove.com/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role":"user","parts":[{"text":"Generate a 16:9 neon city in the rain at night"}]}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {"aspectRatio":"16:9","imageSize":"2K"}
    }
  }'
```

## Native Gemini editing

Gemini has no separate native editing endpoint. Send the reference image as `inlineData` to the same `generateContent` endpoint.

```bash
IMAGE_B64=$(base64 < input.png | tr -d '\n')

curl "https://ai.silicogrove.com/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\":[{\"role\":\"user\",\"parts\":[
      {\"text\":\"Keep the subject and change the background to a city at night\"},
      {\"inlineData\":{\"mimeType\":\"image/png\",\"data\":\"${IMAGE_B64}\"}}
    ]}],
    \"generationConfig\":{\"responseModalities\":[\"TEXT\",\"IMAGE\"],\"imageConfig\":{\"aspectRatio\":\"1:1\",\"imageSize\":\"2K\"}}
  }"
```

When R2 upload succeeds, generated media appears as `fileData.fileUri`; otherwise Gemini returns the original `inlineData` base64 payload.

## Parameter mapping for Gemini models

| OpenAI image parameter | Native Gemini field |
| --- | --- |
| `prompt` | `contents[].parts[].text` |
| `image` file | `contents[].parts[].inlineData` |
| `size: 1024x1024` | `aspectRatio: 1:1` |
| `size: 1792x1024` | `aspectRatio: 16:9` |
| `size: 1024x1792` | `aspectRatio: 9:16` |
| `size: 1536x1024` | `aspectRatio: 3:2` |
| `size: 1024x1536` | `aspectRatio: 2:3` |
| `quality: auto`, `fast`, or `1k` | `imageSize: 1K` |
| `quality: high`, `hd`, or `2k` | `imageSize: 2K` |
| `quality: 4k` | `imageSize: 4K` |

Gemini image models currently generate one image per request: set `n` to `1`.

## Recommended integration

Use the OpenAI-compatible endpoints for standard clients and relay integrations:

```text
POST /v1/images/generations
POST /v1/images/edits
POST /v1/images/tasks
GET /v1/images/tasks/{task_id}
```

Use `POST /v1beta/models/{model}:generateContent` only when you need the complete Gemini request format, multimodal `contents`, or the Gemini SDK.
