---
class: api-page
---

# 异步图片生成与编辑（推荐）

<p class="api-section-description">图片生成时间长短不确定，使用异步任务更适合接口调用：先提交，再查询结果。</p>

推荐使用异步任务生成和编辑图片。提交成功后会返回任务 ID，随后查询任务获取图片，避免长时间等待同步响应。

| 需求 | 完整流程 |
| --- | --- |
| 修改本地图片 | 上传参考图 → 提交任务 → 轮询任务 |
| 根据文字直接生图 | 提交任务 → 轮询任务 |

每个代码块都是一条独立的 curl 命令，可替换后直接复制到终端执行，无需先设置变量。所有命令中的 `YOUR_API_KEY` 都替换为自己的 API Key。

## 改图：上传参考图 → 提交任务 → 轮询任务

### 第一步：分别上传两张本地参考图

本例用第一张图片提供主体、第二张图片提供背景。将文件路径替换为电脑上的真实路径。

上传主体图：

```bash
curl --request POST \
  'https://ai.silicogrove.com/pg/assets' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'kind=image' \
  --form 'file=@/path/to/subject.jpg'
```

上传背景图：

```bash
curl --request POST \
  'https://ai.silicogrove.com/pg/assets' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --form 'kind=image' \
  --form 'file=@/path/to/background.jpg'
```

两次上传分别返回自己的 `data.url`：将下面 JSON 中的 `YOUR_SUBJECT_IMAGE_URL` 替换为主体图返回的 URL，`YOUR_BACKGROUND_IMAGE_URL` 替换为背景图返回的 URL。任意一次上传失败，都先解决错误再提交。

### 第二步：提交改图任务

```bash
curl --request POST \
  'https://ai.silicogrove.com/v1/images/tasks' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "model": "gpt-image-2",
  "prompt": "保留第一张参考图中的主体，将其自然地放入第二张参考图的背景中，统一光线、透视和阴影",
  "images": [
    {"image_url": "YOUR_SUBJECT_IMAGE_URL"},
    {"image_url": "YOUR_BACKGROUND_IMAGE_URL"}
  ],
  "size": "1024x1024",
  "quality": "high",
  "n": 1
}'
```

提交成功返回 HTTP `202`，从响应中复制 `id`。此时任务只是已受理，图片尚未生成完成。

`images` 中第一项对应主体图，第二项对应背景图，顺序与提示词一致。`n: 1` 表示生成一张结果图，不是只接收一张参考图。单图改图只上传一张并保留数组第一项；更多参考图按相同方式上传并追加，最多 `10` 张。

### 第三步：轮询改图任务

将请求地址中的 `YOUR_TASK_ID` 替换为第二步返回的完整 `id`，执行查询：

```bash
curl --request GET \
  'https://ai.silicogrove.com/v1/images/tasks/YOUR_TASK_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

每隔 `2` 至 `5` 秒重复执行查询命令。`queued` / `processing` 表示继续等待；`completed` 时读取 `data[].url` 下载图片并停止查询；`failed` 时读取 `error.message` 并停止查询。查询失败时先检查 HTTP 错误，不要自动重新提交生成任务。

## 直接生图：提交任务 → 轮询任务

### 第一步：提交生图任务

只提供提示词和生成参数，**不要传 `images`，也不要传 `images: []`、`image` 或 `mask`**。

```bash
curl --request POST \
  'https://ai.silicogrove.com/v1/images/tasks' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "model": "gpt-image-2",
    "prompt": "一只坐在窗边的猫，真实摄影风格",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
  }'
```

### 第二步：轮询生图任务

将请求地址中的 `YOUR_TASK_ID` 替换为本次提交返回的完整 `id`：

```bash
curl --request GET \
  'https://ai.silicogrove.com/v1/images/tasks/YOUR_TASK_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

每隔 `2` 至 `5` 秒重复执行查询命令。`queued` / `processing` 表示继续等待；`completed` 时读取 `data[].url` 下载图片并停止查询；`failed` 时读取 `error.message` 并停止查询。查询失败时先检查 HTTP 错误，不要自动重新提交生成任务。

## 请求参数

### 通用请求头

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `Authorization` | string | 是 | `Bearer YOUR_API_KEY`。上传、提交和查询都需要鉴权，查询者须为创建任务的用户。 |
| `Content-Type` | string | 提交 JSON 时是 | 提交任务使用 `application/json`；上传文件时由 curl 的 `-F` 自动生成 `multipart/form-data` 和 boundary，不要手动填写。GET 查询不需要此请求头。 |

### 上传参考图：`POST /pg/assets`

使用 multipart 表单，每次请求上传一张图片。多张图片分别上传。

| 参数 | 类型 | 必填 | 取值或限制 | 说明 |
| --- | --- | --- | --- | --- |
| `kind` | string | 是 | `image` | 声明上传的是参考图片。 |
| `file` | file | 是 | JPEG、PNG、WebP；非空且不超过 `10 MiB` | 本地参考图文件。curl 使用 `--form 'file=@/本地路径/图片.jpg'`；成功后使用响应的 `data.url`。 |

### 提交任务：`POST /v1/images/tasks`

以下是上述 JSON 流程的参数。不同模型支持的尺寸、质量和高级选项可能不同，不应将所有可选参数一并发送。

| 参数 | 类型 | 必填 | 取值或限制 | 说明 |
| --- | --- | --- | --- | --- |
| `model` | string | 是 | 以 `GET /v1/models` 为准 | 使用的图片模型，例如 `gpt-image-2`。 |
| `prompt` | string | 是 | 非空文本 | 描述生成或编辑要求。多图时明确说明第一张、第二张图片的用途，与 `images` 数组顺序对应。 |
| `images` | object[] | 改图时是 | `1` 至 `10` 项 | 参考图数组；直接生图省略整个字段，不传空数组。参考图数量与输出数量 `n` 无关。 |
| `images[].image_url` | string | 每项必填 | 使用上传响应的 `data.url` | 每张参考图的地址，每个对象只能包含此字段。接口也接受完整的图片 data URL，但本流程统一先上传本地图片。 |
| `n` | integer | 否 | 默认 `1`，建议显式传 `1` 至 `10` | 期望生成的结果图片数。Gemini 图片模型设为 `1`；其他模型可能有更小限制。 |
| `size` | string | 否 | 例如 `1024x1024`、`1536x1024`、`1024x1536` | 输出尺寸；具体可选值和省略后的行为由模型决定。示例显式使用 `1024x1024`。 |
| `quality` | string | 否 | 例如 `auto`、`low`、`medium`、`high`；Gemini 可用 `1k`、`2k`、`4k` | 输出质量或分辨率档位，取决于模型。示例使用 `high`，不要假设各模型支持同一组枚举。 |
| `stream` | boolean | 否 | 省略或 `false` | 异步任务通过查询获取结果，不支持 `true`。 |
| `response_format` | string | 否 | 建议省略 | 可影响上游返回格式，但异步任务最终统一返回保存后的 `data[].url`，不会把 base64 作为最终结果返回。 |
| `background` | string | 否 | 常见 `auto`、`opaque`、`transparent` | 背景模式，仅支持此参数的模型可用。 |
| `output_format` | string | 否 | 常见 `png`、`jpeg`、`webp` | 输出图片格式，仅部分模型支持。 |
| `output_compression` | integer | 否 | 通常 `0` 至 `100` | JPEG/WebP 压缩质量，仅部分模型支持。 |
| `style` | string | 否 | 常见 `vivid`、`natural` | 图片风格，仅部分模型支持。 |
| `moderation` | string | 否 | 常见 `auto`、`low` | 审核强度，仅部分模型支持。 |
| `input_fidelity` | string | 否 | 常见 `low`、`high` | 编辑时参考图保真度，仅部分模型支持。 |
| `mask` | string | 否 | 模型支持的遮罩引用 | 指定编辑区域，须同时提供参考图；不是本双图示例的必需参数。Gemini 改图不支持。 |

`YOUR_API_KEY`、`YOUR_SUBJECT_IMAGE_URL`、`YOUR_BACKGROUND_IMAGE_URL` 和 `YOUR_TASK_ID` 是需要替换的占位文本。图片 URL 必须来自第一步的上传响应，任务 ID 必须来自提交响应。不要将本地文件路径直接填入 `images[].image_url`。

### 轮询任务：`GET /v1/images/tasks/{task_id}`

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `task_id` | URL 路径 | string | 是 | 提交响应中的 `id`，例如 `task_0123456789abcdef`。查询不传请求体；路径中使用本次提交返回的真实 ID。 |

每隔 `2` 至 `5` 秒查询一次，在 `completed` 或 `failed` 时停止。状态、结果和错误字段见下方“任务响应参考”。

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

