---
class: api-page
---

# 图片生成与编辑

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

支持 PNG、JPG、JPEG、WebP。游乐场当前每次仅允许上传一张参考图，单文件最大 `10 MB`。

## OpenAI 兼容响应

R2 上传成功时返回 URL：

```json
{"created":1786192453,"data":[{"url":"https://file.lunadownload.com/temporary/2026/08/12/uuid.png"}]}
```

R2 未配置或上传失败时返回 `b64_json`：

```json
{"created":1786192453,"data":[{"b64_json":"iVBORw0KGgo..."}]}
```

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

普通用户和二次中转用户统一使用 OpenAI 兼容协议：

```text
POST /v1/images/generations
POST /v1/images/edits
```

只有需要完整 Gemini 请求结构、多模态 `contents` 组合或 Gemini SDK 时，才使用 `POST /v1beta/models/{model}:generateContent`。
