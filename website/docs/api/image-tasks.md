---
class: api-page
---

# Async Image Generation and Editing (Recommended)

<p class="api-section-description">Image generation time varies, so asynchronous tasks suit API integrations: submit first, then query for the result.</p>

Use asynchronous tasks to generate and edit images. Submit a task, receive its ID, then query for the result without holding a synchronous request open.

| Goal | Complete workflow |
| --- | --- |
| Edit a local image | Upload reference → Submit task → Poll task |
| Generate from text | Submit task → Poll task |

Each code block is an independent curl command. Replace its placeholders and paste it directly into a terminal; no variable setup is needed. Replace `YOUR_API_KEY` in every command with your API key.

## Editing: Upload reference → Submit task → Poll task

### Step 1: Upload two local reference images separately

Use the first image for the subject and the second for the background. Replace each file path with a real file on your computer.

Upload the subject image:

```bash
curl --request POST \
  'https://ai.silicogrove.com/pg/assets' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'kind=image' \
  --form 'file=@/path/to/subject.jpg'
```

Upload the background image:

```bash
curl --request POST \
  'https://ai.silicogrove.com/pg/assets' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'kind=image' \
  --form 'file=@/path/to/background.jpg'
```

Each upload returns its own `data.url`. Replace `YOUR_SUBJECT_IMAGE_URL` in the JSON below with the subject upload URL and `YOUR_BACKGROUND_IMAGE_URL` with the background upload URL. If either upload fails, resolve the error before submitting.

### Step 2: Submit the editing task

```bash
curl --request POST \
  'https://ai.silicogrove.com/v1/images/tasks' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "model": "gpt-image-2",
  "prompt": "Keep the subject from the first reference image and place it naturally into the background from the second reference image, matching lighting, perspective, and shadows",
  "images": [
    {"image_url": "YOUR_SUBJECT_IMAGE_URL"},
    {"image_url": "YOUR_BACKGROUND_IMAGE_URL"}
  ],
  "size": "1024x1024",
  "quality": "high",
  "n": 1
}'
```

A successful submission returns HTTP `202`. Copy its `id`. This means the task was accepted; the image is not ready yet.

The first `images` item is the subject and the second is the background, matching the prompt. `n: 1` requests one output image; it does not limit the reference count to one. For a single reference, upload one file and keep only the first array item. Upload and append further references the same way, up to `10`.

### Step 3: Poll the editing task

Replace `YOUR_TASK_ID` in the URL with the complete `id` returned by Step 2:

```bash
curl --request GET \
  'https://ai.silicogrove.com/v1/images/tasks/YOUR_TASK_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

Repeat the query every `2` to `5` seconds. Keep waiting for `queued` / `processing`; stop on `completed` and download the images from `data[].url`, or stop on `failed` and read `error.message`. On an HTTP error, inspect the response instead of automatically resubmitting a generation task.

## Text-to-image: Submit task → Poll task

### Step 1: Submit the generation task

Send the prompt and generation parameters. **Omit `images`; do not send `images: []`, `image`, or `mask`.**

```bash
curl --request POST \
  'https://ai.silicogrove.com/v1/images/tasks' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "gpt-image-2",
    "prompt": "A cat sitting by a window, realistic photography",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }'
```

### Step 2: Poll the generation task

Replace `YOUR_TASK_ID` in the URL with the complete `id` returned by this submission:

```bash
curl --request GET \
  'https://ai.silicogrove.com/v1/images/tasks/YOUR_TASK_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

Repeat the query every `2` to `5` seconds. Keep waiting for `queued` / `processing`; stop on `completed` and download the images from `data[].url`, or stop on `failed` and read `error.message`. On an HTTP error, inspect the response instead of automatically resubmitting a generation task.

## Request parameters

### Common headers

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `Authorization` | string | Yes | `Bearer YOUR_API_KEY`. Required for upload, submission, and retrieval. Only the task owner can retrieve the task. |
| `Content-Type` | string | For JSON submission | Use `application/json` to submit JSON. For uploads, let curl `-F` generate `multipart/form-data` and its boundary. GET retrieval needs no Content-Type header. |

### Upload reference: `POST /pg/assets`

Use a multipart form. Upload one image per request; upload multiple references separately.

| Parameter | Type | Required | Values or limits | Description |
| --- | --- | --- | --- | --- |
| `kind` | string | Yes | `image` | Identifies the upload as an image reference. |
| `file` | file | Yes | JPEG, PNG, WebP; nonempty, up to `10 MiB` | A local image file. Use curl `--form 'file=@/local/path/image.jpg'`, then read `data.url` from the successful response. |

### Submit task: `POST /v1/images/tasks`

These parameters apply to the JSON workflows above. Supported sizes, quality levels, and advanced options vary by model; do not send every optional parameter by default.

| Parameter | Type | Required | Values or limits | Description |
| --- | --- | --- | --- | --- |
| `model` | string | Yes | Available via `GET /v1/models` | The image model, such as `gpt-image-2`. |
| `prompt` | string | Yes | Nonempty text | Generation or editing instructions. For multiple images, describe the role of each reference in array order. |
| `images` | object[] | For editing | `1` to `10` items | Reference images. Omit this field entirely for text-to-image; do not send an empty array. Reference count is independent of output count `n`. |
| `images[].image_url` | string | In every item | Use the upload response's `data.url` | Reference image URL. Each object must contain only this field. The API also accepts a complete image data URL; this workflow consistently uploads local files first. |
| `n` | integer | No | Defaults to `1`; explicitly send `1` to `10` | Requested output image count. Use `1` for Gemini image models; other models may impose a smaller limit. |
| `size` | string | No | For example `1024x1024`, `1536x1024`, `1024x1536` | Output size. Supported values and omission behavior depend on the model. Examples explicitly use `1024x1024`. |
| `quality` | string | No | For example `auto`, `low`, `medium`, `high`; Gemini supports `1k`, `2k`, `4k` | Output quality or resolution tier, depending on the model. Examples use `high`; models do not necessarily support the same values. |
| `stream` | boolean | No | Omit or use `false` | Retrieve async results by polling; `true` is unsupported. |
| `response_format` | string | No | Omit for these workflows | May affect the upstream response, but async tasks always return stored `data[].url` values, not base64 output. |
| `background` | string | No | Commonly `auto`, `opaque`, `transparent` | Background mode, supported only by some models. |
| `output_format` | string | No | Commonly `png`, `jpeg`, `webp` | Output image format, supported only by some models. |
| `output_compression` | integer | No | Usually `0` to `100` | JPEG/WebP compression quality, supported only by some models. |
| `style` | string | No | Commonly `vivid`, `natural` | Image style, supported only by some models. |
| `moderation` | string | No | Commonly `auto`, `low` | Moderation strength, supported only by some models. |
| `input_fidelity` | string | No | Commonly `low`, `high` | Editing reference fidelity, supported only by some models. |
| `mask` | string | No | A mask reference supported by the model | Specifies the editing area and requires reference images. Not needed for this two-image example. Unsupported for Gemini edits. |

`YOUR_API_KEY`, `YOUR_SUBJECT_IMAGE_URL`, `YOUR_BACKGROUND_IMAGE_URL`, and `YOUR_TASK_ID` are placeholders to replace. Image URLs must come from Step 1 upload responses; task IDs must come from submission responses. Do not pass local file paths as `images[].image_url`.

### Poll task: `GET /v1/images/tasks/{task_id}`

| Parameter | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `task_id` | URL path | string | Yes | The `id` returned by submission, such as `task_0123456789abcdef`. Send no request body. Use the actual ID returned for this task. |

Query every `2` to `5` seconds and stop on `completed` or `failed`. See “Task response reference” below for status, output, and error fields.

## Parameters and limits

- Available models depend on `GET /v1/models`. Examples use `gpt-image-2`; Gemini image models require `n: 1`. See [image parameters](/api/#images).
- R2 storage must be enabled. Omit `stream` or set it to `false`. Tasks become `completed` after results are stored; provider or storage failures refund the reserved quota.
- Upload JPEG, PNG, or WebP images, up to `10 MiB` each. JSON edits use `images[].image_url`, not a standalone `image`, string arrays, or extra object fields. Gemini edits do not support `mask`.
- Uploaded references and output URLs are temporary. Download results promptly. See [reference assets](/api/#assets) for upload details.

## Task response reference

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

