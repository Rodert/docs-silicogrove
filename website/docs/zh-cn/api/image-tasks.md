---
class: api-page
---

# 异步图片生成与编辑（推荐）

推荐使用异步任务生成和编辑图片。提交成功后会返回任务 ID，随后查询任务获取图片，避免长时间等待同步响应。

| 需求 | 完整流程 |
| --- | --- |
| 修改本地图片 | 上传参考图 → 提交任务 → 轮询任务 |
| 根据文字直接生图 | 提交任务 → 轮询任务 |

以下命令在同一个终端中依次执行。将 `YOUR_API_KEY` 替换为自己的 Key；改图时还需替换本地图片路径。

```bash
API_KEY='YOUR_API_KEY'
```

## 改图：上传参考图 → 提交任务 → 轮询任务

### 第一步：上传本地参考图

将 `/path/to/reference.jpg` 换成你电脑上的图片路径。

```bash
curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/pg/assets' \
  -H "Authorization: Bearer $API_KEY" \
  -F 'kind=image' \
  -F 'file=@/path/to/reference.jpg'
```

上传成功后，从响应中复制 `data.url`，填入下面的 `IMAGE_URL`。上传失败时先解决错误，不要继续提交。

### 第二步：提交改图任务

```bash
IMAGE_URL='粘贴第一步返回的 data.url'

curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/v1/images/tasks' \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary @- <<JSON
{
  "model": "gpt-image-2",
  "prompt": "保留参考图中的主体，将背景改为浅灰色",
  "images": [{"image_url": "$IMAGE_URL"}],
  "size": "1024x1024",
  "quality": "high",
  "n": 1
}
JSON
```

提交成功返回 HTTP `202`，从响应中复制 `id`。此时任务只是已受理，图片尚未生成完成。

多张参考图时，先对每张本地图片分别执行第一步，再把各自返回的 `data.url` 按顺序放入 `images` 数组，每张一项 `{"image_url": "上传返回的 data.url"}`，最多 `10` 张。

### 第三步：轮询改图任务

将第二步返回的 `id` 填入 `TASK_ID`，执行查询：

```bash
TASK_ID='粘贴提交响应中的 id'

curl --fail-with-body --silent --show-error \
  "https://ai.silicogrove.com/v1/images/tasks/$TASK_ID" \
  -H "Authorization: Bearer $API_KEY"
```

每隔 `2` 至 `5` 秒重复执行查询命令。`queued` / `processing` 表示继续等待；`completed` 时读取 `data[].url` 下载图片并停止查询；`failed` 时读取 `error.message` 并停止查询。查询失败时先检查 HTTP 错误，不要自动重新提交生成任务。

## 直接生图：提交任务 → 轮询任务

### 第一步：提交生图任务

只提供提示词和生成参数，**不要传 `images`，也不要传 `images: []`、`image` 或 `mask`**。

```bash
curl --fail-with-body --silent --show-error \
  'https://ai.silicogrove.com/v1/images/tasks' \
  -H "Authorization: Bearer $API_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "model": "gpt-image-2",
    "prompt": "一只坐在窗边的猫，真实摄影风格",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }'
```

### 第二步：轮询生图任务

将本次提交返回的 `id` 填入 `TASK_ID`：

```bash
TASK_ID='粘贴提交响应中的 id'

curl --fail-with-body --silent --show-error \
  "https://ai.silicogrove.com/v1/images/tasks/$TASK_ID" \
  -H "Authorization: Bearer $API_KEY"
```

每隔 `2` 至 `5` 秒重复执行查询命令。`queued` / `processing` 表示继续等待；`completed` 时读取 `data[].url` 下载图片并停止查询；`failed` 时读取 `error.message` 并停止查询。查询失败时先检查 HTTP 错误，不要自动重新提交生成任务。

## 参数与使用限制

- 可用模型以 `GET /v1/models` 为准。示例使用 `gpt-image-2`；Gemini 图片模型每次设置 `n: 1`。通用参数见[图片参数](/zh-cn/api/#images)。
- 异步任务需要本站启用 R2 存储；`stream` 必须省略或为 `false`。生成结果保存成功后才会返回 `completed`，上游或保存失败会退还预扣额度。
- 上传图片支持 JPEG、PNG、WebP，单张最大 `10 MiB`。JSON 改图统一使用 `images[].image_url`，不接受单独的 `image`、字符串数组或额外对象字段；Gemini 改图不支持 `mask`。
- 上传和生成的链接均为临时链接，请在完成后尽快下载保存。上传接口详情见[上传参考素材](/zh-cn/api/#assets)。

## 任务响应参考

### 提交响应

提交成功返回 HTTP `202 Accepted`：

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

### 查询任务

```bash
curl "https://ai.silicogrove.com/v1/images/tasks/task_0123456789abcdef" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

任务只能由创建它的用户查询。建议每 `2` 至 `5` 秒轮询一次，不要高频并发查询。

| 字段 | 类型 | 出现条件 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 始终 | 公开任务 ID，格式为 `task_...`。 |
| `object` | string | 始终 | 固定为 `image.task`。 |
| `status` | string | 始终 | `queued`、`processing`、`completed` 或 `failed`。 |
| `progress` | string | 始终 | 百分比字符串，例如 `0%`、`10%`、`100%`。 |
| `created_at` | integer | 始终 | 任务提交 Unix 时间戳。 |
| `started_at` | integer | 始终 | 开始执行 Unix 时间戳；未开始时为 `0`。 |
| `completed_at` | integer | 始终 | 终态 Unix 时间戳；未完成时为 `0`。 |
| `created` | integer | 成功 | 图片结果中的创建时间戳。 |
| `data` | array | 成功 | 图片结果列表，主要读取 `data[].url`。 |
| `error.message` | string | 失败 | 任务失败原因。 |
| `error.type` | string | 失败 | 当前为 `image_task_failed`。 |

| `status` | 含义 | 是否终态 |
| --- | --- | --- |
| `queued` | 已进入队列，等待后台执行 | 否 |
| `processing` | 正在调用上游或保存结果 | 否 |
| `completed` | 已完成，`data[].url` 可用 | 是 |
| `failed` | 执行失败，查看 `error` | 是 |

成功响应：

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

失败响应：

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

### 异步 HTTP 状态码

| 状态码 | 场景 |
| --- | --- |
| `202` | 任务创建成功。 |
| `400` | 参数、multipart 文件、`n` 或 `stream` 无效。 |
| `403` | API Key、额度、分组或模型权限不足。 |
| `404` | 任务不存在、类型不匹配，或不属于当前用户。 |
| `429` | 请求频率或模型并发受限。 |
| `503` | 异步任务所需的 R2 存储未配置或不可用。 |

提交或查询请求在进入任务状态前失败时，使用统一错误结构：

```json
{
  "error": {
    "message": "R2 storage is required for asynchronous image tasks",
    "type": "storage_unavailable",
    "code": "storage_unavailable"
  }
}
```

当前没有 `/v1/images/tasks/{task_id}/content` 接口，请直接下载完成响应中的 `data[].url`。

