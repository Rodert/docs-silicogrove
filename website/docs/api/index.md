---
class: api-page
---

# Silico Grove API 概览

按本手册可接入文本、图片、视频和音频能力。不同能力应使用对应 endpoint，并保留原始字段名。

## 服务地址

| 项目 | 值 |
| --- | --- |
| 首选 Base URL | `https://ai.silicogrove.com/v1` |
| 备用 Base URL | `https://api.silicogrove.com/v1`，首选域名不可用时切换 |
| 认证 | `Authorization: Bearer YOUR_API_KEY` |
| JSON 请求 | `Content-Type: application/json` |
| 文件上传 | `multipart/form-data` |

## 阅读顺序

1. 从 [快速接入](/api/quickstart) 创建 Key、查询模型并完成最小请求。
2. 从 [模型与权限](/api/models) 确认可使用的模型和对应接口。
3. 根据需求进入文本、图片、视频或音频的能力文档。

::: tip
模型可用性由账号、分组和 API Key 权限共同决定。请始终以 `GET /v1/models` 的实际返回结果为准。
:::
