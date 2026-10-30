---
class: api-page
---

# 同步图片生成与编辑

推荐使用[异步图片任务](/zh-cn/api/#image-tasks)：改图按“上传 → 提交 → 轮询”，生图按“提交 → 轮询”。本节介绍同步接口及 Gemini 原生协议。

实际可用模型以 API Key 请求 `GET /v1/models` 的结果为准：

```bash
curl "https://ai.silicogrove.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

| 模型 | 图片生成 | 图片编辑 | OpenAI 图片协议 | Gemini 原生协议 |
| --- | --- | --- | --- | --- |
| `gpt-image-2` | 支持 | 支持 | 支持 | 不支持 |
| `gpt-image-2-all` | 取决于 `/v1/models` 是否可见 | 取决于上游 | 支持 | 不支持 |
| `gemini-3-pro-image` | 支持 | 支持 | 支持 | 支持 |
| `gemini-3.1-flash-image` | 支持 | 支持 | 支持 | 支持 |
| `gemini-3-pro-image-preview` | 支持 | 支持 | 支持 | 支持 |
| `gemini-3.1-flash-image-preview` | 支持 | 支持 | 支持 | 支持 |
| `gemini-2.5-flash-image` | 支持 | 支持 | 支持 | 支持 |
| `grok-imagine-image`、`grok-imagine-image-pro` | 取决于 `/v1/models` 是否可见 | 取决于上游 | 支持 | 不支持 |

推荐 Base URL 为 `https://ai.silicogrove.com`，备用地址为 `https://api.silicogrove.com`。所有请求使用 `Authorization: Bearer YOUR_API_KEY` 认证。

## OpenAI 兼容生图

适用于 `gpt-image-2` 和 Gemini 图片模型。

```bash
curl "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "一张高级感产品海报，真实摄影风格，干净背景",
    "size": "1024x1024",
    "quality": "high",
    "n": 1,
    "response_format": "url"
  }'
```

Gemini 模型示例：

```bash
curl "https://ai.silicogrove.com/v1/images/generations" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image",
    "prompt": "一张 16:9 的雨夜霓虹城市图片",
    "size": "1792x1024",
    "quality": "2k",
    "n": 1,
    "response_format": "url"
  }'
```

## OpenAI 兼容改图

使用 `multipart/form-data`。上传文件时不要手动填写 `Content-Type`，应让 curl 或 SDK 自动生成 multipart boundary。

```bash
curl "https://ai.silicogrove.com/v1/images/edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=保持主体不变，把背景换成夜晚城市" \
  -F "image=@/path/to/input.png" \
  -F "size=1024x1024" \
  -F "quality=high" \
  -F "n=1"
```

调用 Gemini 改图时将 `model` 改为 `gemini-3.1-flash-image`，并使用 `quality=2k`。

支持 PNG、JPG、JPEG、WebP。游乐场当前每次最多上传 `3` 张参考图，单文件最大 `10 MB`。

## OpenAI 图片参数

以下是网关可接收的常用字段。具体模型可能只支持其中一部分；不支持的枚举可能被上游忽略或拒绝，请以模型能力和实际响应为准。

| 字段 | 类型 | 必填 | 常见值或限制 | 说明 |
| --- | --- | --- | --- | --- |
| `model` | string | 是 | 以 `GET /v1/models` 为准 | 图片模型名称。 |
| `prompt` | string | 是 | 自然语言文本 | 生成或编辑要求。 |
| `n` | integer | 否 | `1` 至 `10`；默认 `1` | 生成数量。Gemini 图片模型应设置为 `1`，其他模型也可能有更小限制。 |
| `size` | string | 否 | 常见 `1024x1024`、`1536x1024`、`1024x1536`、`1792x1024`、`1024x1792` | 尺寸或比例映射取决于模型。DALL-E 模型有更严格的尺寸枚举。 |
| `quality` | string | 否 | 常见 `auto`、`low`、`medium`、`high`、`standard`、`hd`、`1k`、`2k`、`4k` | 质量或输出分辨率档位，区分大小写的行为取决于上游。 |
| `response_format` | string | 否 | `url`、`b64_json` | 同步接口的期望返回格式。异步任务最终只返回持久化后的 URL。 |
| `background` | string | 否 | `auto`、`opaque`、`transparent` | 背景模式，仅部分模型支持。 |
| `output_format` | string | 否 | `png`、`jpeg`、`webp` | 输出文件格式，仅部分模型支持。 |
| `output_compression` | integer | 否 | 通常 `0` 至 `100` | JPEG/WebP 压缩质量，仅部分模型支持。 |
| `style` | string | 否 | 常见 `vivid`、`natural` | 风格选项，仅部分模型支持。 |
| `moderation` | string | 否 | 常见 `auto`、`low` | 内容审核强度，仅部分模型支持。 |
| `stream` | boolean | 否 | `true`、`false` | 同步接口是否请求流式返回；异步任务必须为 `false` 或省略。 |
| `image`、`image[]` | file | multipart 改图时是 | PNG、JPEG、WebP；异步任务最多 `10` 张，单文件最大 `10 MB` | 参考图。多图使用 `image[]`；异步 multipart 文件会先保存再由 worker 发送。 |
| `images` | object array | 异步 JSON 改图时是 | 最多 `10` 项 | 每项必须且只能包含 `image_url`。 |
| `mask` | file 或模型支持的 JSON URL/值 | 否 | 通常为 PNG | 编辑遮罩，仅部分模型支持。 |
| `input_fidelity` | string | 否 | 常见 `low`、`high` | 参考图保真度，仅部分模型支持。 |

使用 `curl -F` 时不要手动设置 `Content-Type`。multipart 的 `n`、`output_compression` 等标量应作为文本表单字段发送。

## OpenAI 兼容响应

R2 上传成功时返回 URL：

```json
{"created":1786192453,"data":[{"url":"https://file.lunadownload.com/temporary/2026/08/12/uuid.png"}]}
```

R2 未配置或上传失败时返回 `b64_json`：

```json
{"created":1786192453,"data":[{"b64_json":"iVBORw0KGgo..."}]}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `created` | integer | 上游返回的图片创建时间戳。 |
| `data` | array | 图片结果列表。 |
| `data[].url` | string | R2 或上游图片 URL。URL 可能被定期清理。 |
| `data[].b64_json` | string | Base64 图片。通常只在同步请求且 R2 未生效时出现。 |
| `data[].revised_prompt` | string | 上游改写后的提示词；仅部分模型返回。 |

::: warning 临时图片链接
通过 `file.lunadownload.com` 返回的图片属于临时文件，系统会定期清理。请在生成完成后尽快下载并自行保存。
:::

## Gemini 原生生图

仅适用于 Gemini 图片模型，`gpt-image-2` 不支持此协议。

```bash
curl "https://ai.silicogrove.com/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"role":"user","parts":[{"text":"生成一张 16:9 的雨夜霓虹城市图片"}]}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {"aspectRatio":"16:9","imageSize":"2K"}
    }
  }'
```

## Gemini 原生改图

Gemini 没有单独的原生 edits endpoint。生图和改图都调用 `generateContent`；改图时需在 `parts` 中增加参考图片的 `inlineData`。

```bash
IMAGE_B64=$(base64 < input.png | tr -d '\n')

curl "https://ai.silicogrove.com/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\":[{\"role\":\"user\",\"parts\":[
      {\"text\":\"保持主体不变，把背景换成夜晚城市\"},
      {\"inlineData\":{\"mimeType\":\"image/png\",\"data\":\"${IMAGE_B64}\"}}
    ]}],
    \"generationConfig\":{\"responseModalities\":[\"TEXT\",\"IMAGE\"],\"imageConfig\":{\"aspectRatio\":\"1:1\",\"imageSize\":\"2K\"}}
  }"
```

R2 上传成功后，生成图片以 `fileData.fileUri` 返回；R2 上传失败时保留 Gemini 原始 `inlineData` base64。

## Gemini 参数映射

使用 OpenAI 图片协议调用 Gemini 模型时，参数会按以下规则转换：

| OpenAI 参数 | Gemini 原生字段 |
| --- | --- |
| `prompt` | `contents[].parts[].text` |
| `image` 文件 | `contents[].parts[].inlineData` |
| `size: 1024x1024` | `aspectRatio: 1:1` |
| `size: 1792x1024` | `aspectRatio: 16:9` |
| `size: 1024x1792` | `aspectRatio: 9:16` |
| `size: 1536x1024` | `aspectRatio: 3:2` |
| `size: 1024x1536` | `aspectRatio: 2:3` |
| `quality: auto`、`fast`、`1k` | `imageSize: 1K` |
| `quality: high`、`hd`、`2k` | `imageSize: 2K` |
| `quality: 4k` | `imageSize: 4K` |

Gemini 图片模型当前每次只能生成一张图片，应设置 `n: 1`。

## 推荐方案

优先使用[异步图片任务](/zh-cn/api/#image-tasks)。需要同步响应时，使用以下 OpenAI 兼容接口：

```text
POST /v1/images/generations
POST /v1/images/edits
```

只有需要完整 Gemini 请求结构、多模态 `contents` 组合或 Gemini SDK 时，才使用 `POST /v1beta/models/{model}:generateContent`。
