---
class: api-page
---

# 视频生成

视频模型必须使用 `POST /v1/videos`，不能作为聊天模型发送到 `/v1/chat/completions`。提交后会返回任务 ID，需要轮询查询。

## 最小文生视频示例

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "video-ds-2.0-fast",
    "prompt": "A cinematic 9:16 short video, neon city rooftop at night, realistic lighting, no watermark.",
    "seconds": "15",
    "aspect_ratio": "9:16"
  }'
```

## 多媒体参考示例

::: tip
参考素材必须是公网可访问 URL。可使用自己的对象存储 URL，或先[上传到临时素材接口](/api/assets)。不要在 JSON 中填写本地文件路径。
:::

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "video-ds-2.0",
    "prompt": "参考图片的人物形象，参考视频的动作节奏，生成一段自然流畅的 9:16 视频",
    "seconds": "15",
    "aspect_ratio": "9:16",
    "images": ["https://example.com/ref-1.jpg"],
    "videos": ["https://example.com/motion.mp4"],
    "audios": ["https://example.com/music.mp3"]
  }'
```

| 字段 | 限制 | 说明 |
| --- | --- | --- |
| `model` | 必填 | 必须是 Key 可见的视频模型。 |
| `prompt` | 必填 | 建议明确主体、动作、镜头、风格与比例。 |
| `seconds` | 建议填写 | 字符串，例如 `"5"`、`"10"`、`"15"`。 |
| `aspect_ratio` | 建议填写 | `16:9`、`9:16` 或 `1:1`。 |
| `images` | 最多 4 张 | jpg、png、webp 的 URL 数组。 |
| `videos` | 最多 3 个 | mp4、mov、webm 的 URL 数组。 |
| `audios` | 最多 1 个 | mp3、m4a、wav、aac、ogg 的 URL 数组。 |

上述参考素材数量限制适用于 `video-ds-2.0`、`video-ds-2.0-fast` 和 `as-sd2.0-fast`；其他视频模型的支持能力可能不同。

## 查询任务与下载视频

```bash
curl -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"

curl -L -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID/content" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  --output result.mp4
```
