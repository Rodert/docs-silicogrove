---
class: api-page
---

# 视频生成

视频生成是异步任务。通过 `POST /v1/videos` 创建任务，保存返回的任务 ID，再轮询 `GET /v1/videos/{task_id}` 直到任务结束。视频模型不能发送到 `/v1/chat/completions`。

可调用模型取决于 API Key 和用户分组。向最终用户展示模型前，请先调用 `GET /v1/models`。

## 首推模型：Grok Video 1.5

| 模型 | 时长 | 分辨率 |
| --- | --- | --- |
| `grok-video-1.5` | 默认 15 秒；可指定 `6`、`8`、`10`、`12`、`15` 秒 | 可选；建议 `720p` |

`grok-video-1.5` 同时支持文生视频、单参考图和多参考图（最多 7 张）。以下三个实例使用相同的接口，仅需根据是否有参考图调整 `image_urls`。

::: warning
不传 `seconds` 时默认生成 15 秒。显式传入时，`seconds` 只能是字符串 `"6"`、`"8"`、`"10"`、`"12"` 或 `"15"`。传入 `"4"` 或其他值会返回：`seconds must be one of: 6, 8, 10, 12, 15`。
:::

## 其他支持的可灵 V3 模型

| 模型 | 时长 | 分辨率 | 计费方式 |
| --- | --- | --- | --- |
| `kling-video-v3` | 3-15 秒 | `720p`、`1080p`、`4k` | 按秒和所选分辨率计费 |
| `kling-video-v3-omni` | 3-15 秒 | `720p`、`1080p`、`4k` | 按秒和所选分辨率计费 |
| `kling-video-v3-turbo` | 3-15 秒 | `720p`、`1080p` | 按秒和所选分辨率计费 |

创建可灵任务时将 `resolution` 作为顶层字段传递。不要使用图像生成的 `quality` 字段表示视频分辨率。实际价格以提交任务时的计算结果为准，不要依赖文档中的固定金额。

## Grok Video 1.5 调用实例

所有实例均使用 `POST /v1/videos`、`Authorization: Bearer YOUR_API_KEY` 和 `Content-Type: application/json`。

### 1. 文生视频

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

### 2. 单参考图视频

```json
{
  "model": "grok-video-1.5",
  "prompt": "让产品平稳旋转，柔和棚拍光线，干净的商业广告镜头",
  "seconds": "10",
  "aspect_ratio": "9:16",
  "resolution": "720p",
  "image_urls": ["https://example.com/product.png"]
}
```

### 3. 多参考图视频

```json
{
  "model": "grok-video-1.5",
  "prompt": "使用这些参考图制作连贯的产品展示视频，电影感运镜与高级商业灯光",
  "seconds": "15",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "image_urls": [
    "https://example.com/product-front.png",
    "https://example.com/product-detail.png"
  ]
}
```

响应会包含公开的 `id` 或 `task_id`。请保存该值；不要使用其他上游响应中的内部任务 ID。

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "object": "video",
  "status": "queued"
}
```

该示例使用首推模型 `grok-video-1.5` 创建 15 秒的文生视频。创建成功后会立即返回异步任务；保存 `task_id`，再用[查询任务](#查询任务)接口获取进度和结果。

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

## 参考素材

参考图可以使用公网 HTTPS URL，或完整的 `data:` URL，例如 `data:image/png;base64,...`。不要传本地文件路径或裸 base64。可先通过[临时素材接口](/zh-cn/api/assets)上传本地文件。

推荐使用 `image_urls`。为兼容既有接入，`images` 也可用，但二者不能同时传递。`reference_images` 以及 `input_reference: {"image_url":"..."}` 也可用于兼容接入；同一请求不能同时传 `reference_images` 和 `input_reference`。

## 请求字段

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `model` | 是 | API Key 可调用的视频模型。 |
| `prompt` | 是 | 建议描述主体、动作、镜头、视觉风格和构图。 |
| `seconds` | 否 | 请求时长，字符串；不传时 `grok-video-1.5` 默认 15 秒。显式传入仅支持 `"6"`、`"8"`、`"10"`、`"12"`、`"15"`。 |
| `aspect_ratio` | 否 | `16:9`、`9:16` 或 `1:1`。 |
| `resolution` | Kling V3 必填；Grok 可选 | Grok 建议传 `720p`；Kling 支持 `480p`、`720p`、`1080p` 或 `4k`，取决于所选模型。作为顶层字段传递，不要用 `quality` 代替。 |
| `image_urls` | 否 | 推荐字段，最多 7 个参考图 URL 或完整 data URL。 |
| `images` | 否 | `image_urls` 的兼容别名；不能同时传。 |
| `image` | 否 | 仅用于 `grok-imagine-video-1.5` 的首帧模式。传单个图片 URL 或完整 data URL；不能与 `reference_images` 同时传。 |
| `reference_images` | 否 | 参考图兼容字段；不能与 `input_reference` 同时传。 |
| `input_reference` | 否 | 单参考图兼容形式：`{ "image_url": "https://..." }`。 |

旧版 `video-ds-*` 模型支持 `images`、`videos`、`audios`，数量上限分别为 4 张图片、3 个视频和 1 个音频。

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

## 安全与稳定建议

### 密钥与调用侧

- 只在服务端的环境变量或密钥管理服务中保存 API Key。浏览器、移动端和公开前端代码不应持有长期 Key。
- 按应用或用途拆分 API Key。发生异常时可单独吊销受影响的 Key，不影响其他业务。
- 创建任务后，将本地业务单号与返回的 `task_id` 一并保存，用于查询、对账和重试控制。

### 参考素材与下载侧

- 参考素材 URL 必须可由视频服务安全访问。不要传入内网 IP、管理地址、云凭据链接或本地文件路径。
- 任务完成后通过受鉴权的 `/content` 接口下载视频，不要将临时结果地址长期公开。
- 仅在任务已明确返回 `failed` 后创建新任务重试。对于 `queued` 或 `in_progress` 状态，应继续查询同一个 `task_id`，避免重复生成和重复计费。

## Grok Imagine 模型（当前下架）

::: warning
`grok-imagine-video` 与 `grok-imagine-video-1.5` 当前已下架，不能用于生产调用。以下内容仅保留为历史参数参考；请使用上文已接通的可灵模型。
:::

| 模型 | 生成方式 | 时长 | 分辨率 |
| --- | --- | --- | --- |
| `grok-imagine-video` | 文生视频 | 取决于模型 | 取决于模型 |
| `grok-imagine-video-1.5` | 文生视频、首帧图生视频、参考图生视频 | `4`、`6`、`8`、`10`、`12`、`15` 秒 | 文生和首帧支持 `480p`、`720p`、`1080p`；参考图最高 `720p` |

`grok-imagine-video-1.5` 有两种互斥的图片模式：首帧模式传 1 个 `image` URL；参考图模式传 1-7 个 `reference_images` URL，并在提示词中使用 `<IMAGE_1>`、`<IMAGE_2>` 等占位符。不要将 `image`、`images`、`image_urls` 或 `input_reference` 与 `reference_images` 同时传递。参考图模式仅支持最高 `720p`。

历史请求示例：

```json
{
  "model": "grok-imagine-video-1.5",
  "prompt": "让 <IMAGE_1> 中的人物在城市街道中行走，电影感商业广告镜头",
  "reference_images": ["https://example.com/person.jpg"],
  "seconds": "8",
  "aspect_ratio": "16:9",
  "resolution": "720p"
}
```
