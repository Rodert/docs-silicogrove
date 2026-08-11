---
class: api-page
---

# 二次中转注意事项

- 首选上游地址填写 `https://ai.silicogrove.com` 或 `https://ai.silicogrove.com/v1`，取决于中转系统是否自动补全 `/v1`。
- 备用地址为 `https://api.silicogrove.com` 或 `https://api.silicogrove.com/v1`；需要由中转系统配置故障切换，不会自动生效。
- 使用 Silico Grove 的 API Key 同步 `/v1/models`，不要手填不存在的模型。
- 视频模型 endpoint 必须为 `/v1/videos`，不要放入聊天模型池。
- 转发视频请求时保留 JSON 原字段，尤其是 `images`、`videos`、`audios` 数组。
- 图片编辑与音频转写是 multipart 请求，转发时不要丢失文件字段。
