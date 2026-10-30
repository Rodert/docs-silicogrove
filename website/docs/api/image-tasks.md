---
class: api-page
---

# Async Image Generation and Editing (Recommended)

Use asynchronous tasks to generate and edit images. Submit a task, receive its ID, then query for the result without holding a synchronous request open.

| Goal | Complete workflow |
| --- | --- |
| Edit a local image | Upload reference → Submit task → Poll task |
| Generate from text | Submit task → Poll task |

Run the commands in the same terminal. Replace `YOUR_API_KEY` with your key and the reference path with a local image file.

```bash
API_KEY='YOUR_API_KEY'
```

## Editing: Upload reference → Submit task → Poll task

### Step 1: Upload a local reference image

Replace `/path/to/reference.jpg` with the path to an image on your computer.

```bash
curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/pg/assets' \
  -H "Authorization: Bearer $API_KEY" \
  -F 'kind=image' \
  -F 'file=@/path/to/reference.jpg'
```

Copy `data.url` from the successful response into `IMAGE_URL` below. If uploading fails, resolve the error before continuing.

### Step 2: Submit the editing task

```bash
IMAGE_URL='PASTE_DATA_URL_FROM_STEP_1'

curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/v1/images/tasks' \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary @- <<JSON
{
  "model": "gpt-image-2",
  "prompt": "Keep the subject and change the background to light gray",
  "images": [{"image_url": "$IMAGE_URL"}],
  "size": "1024x1024",
  "quality": "high",
  "n": 1
}
JSON
```

A successful submission returns HTTP `202`. Copy its `id`. This means the task was accepted; the image is not ready yet.

For multiple references, upload each local file using Step 1, then add each returned `data.url` to `images` in order as an `{"image_url": "RETURNED_DATA_URL"}` object. Up to `10` references are supported.

### Step 3: Poll the editing task

Set `TASK_ID` to the `id` returned by Step 2 and query:

```bash
TASK_ID='TASK_ID_FROM_SUBMISSION'

curl --fail-with-body --silent --show-error \
  "https://ai.silicogrove.com/v1/images/tasks/$TASK_ID" \
  -H "Authorization: Bearer $API_KEY"
```

Repeat the query every `2` to `5` seconds. Keep waiting for `queued` / `processing`; stop on `completed` and download the images from `data[].url`, or stop on `failed` and read `error.message`. On an HTTP error, inspect the response instead of automatically resubmitting a generation task.

## Text-to-image: Submit task → Poll task

### Step 1: Submit the generation task

Send the prompt and generation parameters. **Omit `images`; do not send `images: []`, `image`, or `mask`.**

```bash
curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/v1/images/tasks' \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "gpt-image-2",
    "prompt": "A cat sitting by a window, realistic photography",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }'
```

### Step 2: Poll the generation task

Set `TASK_ID` to the `id` returned by this submission:

```bash
TASK_ID='TASK_ID_FROM_SUBMISSION'

curl --fail-with-body --silent --show-error \
  "https://ai.silicogrove.com/v1/images/tasks/$TASK_ID" \
  -H "Authorization: Bearer $API_KEY"
```

Repeat the query every `2` to `5` seconds. Keep waiting for `queued` / `processing`; stop on `completed` and download the images from `data[].url`, or stop on `failed` and read `error.message`. On an HTTP error, inspect the response instead of automatically resubmitting a generation task.

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

