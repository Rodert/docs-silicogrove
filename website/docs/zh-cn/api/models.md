---
class: api-page
---

# 模型与权限

可调用模型由账号、分组和 API Key 权限共同决定。始终以自己的 `/v1/models` 返回结果为准。

| 场景 | 常见模型示例 | 接口 |
| --- | --- | --- |
| 文本 | `gpt-5.4-mini`、Claude、Gemini 等 | `/v1/chat/completions` |
| 图片 | `gpt-image-2`、Gemini 图片模型、`grok-imagine-image` | 同步 `/v1/images/generations`；异步 `/v1/images/tasks` |
| 视频 | `video-ds-2.0`、`as-sd2.0-fast`、`grok-image-video`、`grok-video-1.5`、`grok-video-1.5-1080p` | `/v1/videos` |
| 音频 | 以模型列表返回为准 | `/v1/audio/*` |

```bash
curl -X GET "https://ai.silicogrove.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```
