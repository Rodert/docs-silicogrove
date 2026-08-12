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

## OpenAI-compatible response

When R2 upload succeeds, a URL is returned:

```json
{"created":1786192453,"data":[{"url":"https://file.lunadownload.com/temporary/2026/08/12/uuid.png"}]}
```

If R2 is not configured or upload fails, the response contains `b64_json` instead:

```json
{"created":1786192453,"data":[{"b64_json":"iVBORw0KGgo..."}]}
```

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
```

Use `POST /v1beta/models/{model}:generateContent` only when you need the complete Gemini request format, multimodal `contents`, or the Gemini SDK.
