---
class: api-page
---

# 视频生成

视频生成是异步任务。通过 `POST /v1/videos` 创建任务，保存返回的任务 ID，再轮询 `GET /v1/videos/{task_id}` 直到任务结束。视频模型不能发送到 `/v1/chat/completions`。

可调用模型取决于 API Key 和用户分组。向最终用户展示模型前，请先调用 `GET /v1/models`。

## 支持的 Grok 视频模型

| 模型 | 文生视频 | 参考图 | 最长时长 | 分辨率 |
| --- | --- | --- | --- | --- |
| `grok-image-video` | 支持 | 1 张图最长 15 秒；2-7 张图最长 10 秒 | 15 秒 | `480p`、`720p` |
| `grok-video-1.5` | 支持 | 0-7 张图 | 15 秒 | `480p`、`720p` |

`grok-video-1.5` 的 `seconds` 只能为 `"4"`、`"6"`、`"8"`、`"10"`、`"12"` 或 `"15"`。传入其他时长会返回 `seconds must be one of: 4, 6, 8, 10, 12, 15`。

`grok-image-video` 使用多参考图时，超过 10 秒的请求会按 10 秒处理。请始终以最终任务结果为准。

## 创建任务

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-video-1.5",
    "prompt": "日出照亮未来海滨城市，航拍镜头缓慢前移，电影感光影",
    "seconds": "15",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

响应会包含公开的 `id` 或 `task_id`。请保存该值；不要使用其他上游响应中的内部任务 ID。

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "object": "video",
  "status": "queued"
}
```

## 参考图生视频

参考图可以使用公网 HTTPS URL，或完整的 `data:` URL，例如 `data:image/png;base64,...`。不要传本地文件路径或裸 base64。可先通过[临时素材接口](/zh-cn/api/assets)上传本地文件。

推荐使用 `image_urls`。为兼容既有接入，`images` 也可用，但二者不能同时传递。`reference_images` 以及 `input_reference: {"image_url":"..."}` 也可用于兼容接入；同一请求不能同时传 `reference_images` 和 `input_reference`。

```bash
curl -X POST "https://ai.silicogrove.com/v1/videos" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-video-1.5",
    "prompt": "柔和棚拍光线下的高端产品展示，镜头缓慢环绕旋转",
    "seconds": "10",
    "aspect_ratio": "9:16",
    "resolution": "720p",
    "image_urls": [
      "https://example.com/product-front.png",
      "https://example.com/product-side.png"
    ]
  }'
```

## 请求字段

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `model` | 是 | API Key 可调用的视频模型。 |
| `prompt` | 是 | 建议描述主体、动作、镜头、视觉风格和构图。 |
| `seconds` | 否 | 请求时长，字符串，例如 `"4"`、`"6"`、`"10"`、`"15"`；实际限制取决于模型。 |
| `aspect_ratio` | 否 | `16:9`、`9:16` 或 `1:1`。 |
| `resolution` | 否 | `480p`、`720p` 或 `1080p`，取决于所选模型。 |
| `image_urls` | 否 | 推荐字段，最多 7 个参考图 URL 或完整 data URL。 |
| `images` | 否 | `image_urls` 的兼容别名；不能同时传。 |
| `reference_images` | 否 | 参考图兼容字段；不能与 `input_reference` 同时传。 |
| `input_reference` | 否 | 单参考图兼容形式：`{ "image_url": "https://..." }`。 |

旧版 `video-ds-*` 模型支持 `images`、`videos`、`audios`，数量上限分别为 4 张图片、3 个视频和 1 个音频。Grok 视频模型不要传视频或音频参考素材。

## 查询任务

```bash
curl -X GET "https://ai.silicogrove.com/v1/videos/TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

`queued`、`in_progress` 表示任务仍在处理中；`completed` 表示视频已可用；`failed` 表示生成失败。建议每 5 秒轮询一次；客户端超时时保留任务 ID，稍后继续查询。

## 下载完成的视频

```bash
curl -L "https://ai.silicogrove.com/v1/videos/TASK_ID/content" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  --output result.mp4
```

服务内部可能返回带签名的临时结果链接，应及时下载。请使用上述内容接口，不要自行拼接上游域名、任务 ID 或签名参数。
