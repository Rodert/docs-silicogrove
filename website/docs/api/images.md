---
class: api-page
---

# Images

## Generate images

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","prompt":"A premium product poster, clean background, realistic photography","size":"1024x1024","quality":"auto","n":1,"response_format":"url"}'
```

| Field | Description |
| --- | --- |
| `model` | Required. An image model visible to the API key. |
| `prompt` | Required. The image description. |
| `size` | Optional, for example `1024x1024` or a supported ratio. |
| `quality` | Optional: `auto`, `low`, `high`, `2K`, or `4K`. |

## Edit images

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=Change the background to city lights at night" \
  -F "image=@/path/to/input.png" \
  -F "size=1024x1024"
```

Use multipart form data for local files. Do not set `Content-Type: application/json`; the image field is `image` and the optional mask field is `mask`.
