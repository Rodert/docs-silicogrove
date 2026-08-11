---
class: api-page
---

# 常见错误

| 现象 | 常见原因 | 处理方式 |
| --- | --- | --- |
| 模型不可用 | 模型和分组不匹配，或 Key 没有权限。 | 用同一个 Key 请求 `/v1/models` 确认模型名。 |
| `model is required` | 字段名被二次中转改写。 | 保留 `model`，不要改成 `model_name`。 |
| 视频失败或走聊天模型 | 视频请求发到了聊天接口。 | 视频必须调用 `POST /v1/videos`。 |
| 参考素材未生效 | 传了本地路径，或字段不是数组。 | 传公网 URL，分别填入 `images`、`videos`、`audios`。 |
| `seconds` 类型错误 | 把时长传成数字。 | 使用字符串，例如 `"seconds": "15"`。 |
| 上传失败 | 手写了错误的 Content-Type，或字段名错误。 | 使用 `-F`；文件字段名为 `file`。 |

排查问题时，请提供请求时间、模型名、接口路径、分组、request ID 和错误内容。请勿公开完整 API Key、`Authorization` 请求头或敏感提示词。
