---
class: api-page
---

# Synchronous Image Generation and Editing

<p class="api-section-description">Synchronous endpoints wait for images within a single request, for clients that need a synchronous response.</p>

Start with [async image tasks](/api/#image-tasks): upload → submit → poll for editing, or submit → poll for text-to-image. This section covers synchronous endpoints and the native Gemini protocol.

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

Supported input formats are PNG, JPG, JPEG, and WebP. The playground currently accepts up to `3` reference images per request, up to `10 MB` each.

## OpenAI image parameters

The gateway accepts the common fields below. Individual models may support only a subset; an upstream may ignore or reject unsupported values. Treat `/v1/models` and the model's actual response as authoritative.

| Field | Type | Required | Common values or limits | Description |
| --- | --- | --- | --- | --- |
| `model` | string | Yes | From `GET /v1/models` | Image model name. |
| `prompt` | string | Yes | Natural-language text | Generation or editing instruction. |
| `n` | integer | No | `1` to `10`; default `1` | Number of images. Gemini image models require `1`; other models may impose lower limits. |
| `size` | string | No | Common: `1024x1024`, `1536x1024`, `1024x1536`, `1792x1024`, `1024x1792` | Size or aspect-ratio mapping is model-dependent. DALL-E models enforce narrower enums. |
| `quality` | string | No | Common: `auto`, `low`, `medium`, `high`, `standard`, `hd`, `1k`, `2k`, `4k` | Quality or output-resolution tier. Upstream case sensitivity may differ. |
| `response_format` | string | No | `url`, `b64_json` | Desired synchronous response. Async tasks always return a persisted URL. |
| `background` | string | No | `auto`, `opaque`, `transparent` | Background mode; model-dependent. |
| `output_format` | string | No | `png`, `jpeg`, `webp` | Output file format; model-dependent. |
| `output_compression` | integer | No | Usually `0` to `100` | JPEG/WebP compression quality; model-dependent. |
| `style` | string | No | Common: `vivid`, `natural` | Style option; model-dependent. |
| `moderation` | string | No | Common: `auto`, `low` | Moderation level; model-dependent. |
| `stream` | boolean | No | `true`, `false` | Requests a streamed synchronous response. Async tasks require `false` or omission. |
| `image`, `image[]` | file | For multipart editing | PNG, JPEG, WebP; async tasks allow at most `10` images, with a per-file limit of `10 MB` | Reference image. Use `image[]` for multiple images. Async multipart files are persisted before worker execution. |
| `images` | object array | For async JSON editing | At most `10` items | Every item must contain only `image_url`. |
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

Prefer [async image tasks](/api/#image-tasks). For clients requiring synchronous responses, use these OpenAI-compatible endpoints:

```text
POST /v1/images/generations
POST /v1/images/edits
```

Use `POST /v1beta/models/{model}:generateContent` only when you need the complete Gemini request format, multimodal `contents`, or the Gemini SDK.
