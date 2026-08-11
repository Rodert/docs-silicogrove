---
class: api-page
---

# 图片生成与编辑

## 图片生成

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "一张高级感产品海报，干净背景，真实摄影风格",
    "size": "1024x1024",
    "quality": "auto",
    "n": 1,
    "response_format": "url"
  }'
```

| 字段 | 说明 |
| --- | --- |
| `model` | 必填，必须是 Key 可见的图片模型。 |
| `prompt` | 必填，图片描述。 |
| `size` | 可选，例如 `1024x1024` 或模型支持的比例。 |
| `quality` | 可选，常见值为 `auto`、`low`、`high`、`2K`、`4K`。 |

## 图片编辑

上传本地图片时，使用 multipart 请求：

```bash
curl -X POST "https://ai.silicogrove.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=把图片里的背景换成夜晚城市灯光" \
  -F "image=@/path/to/input.png" \
  -F "size=1024x1024"
```

::: warning
使用 `-F` 时不要手写 `Content-Type: application/json`。图片字段名为 `image`，遮罩字段名为 `mask`。
:::
