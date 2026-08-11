---
class: api-page
outline: false
---

<div id="overview"></div>

# 给普通用户和二次中转用户的接入手册

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

1. 从 [快速接入](#quickstart) 创建 Key、查询模型并完成最小请求。
2. 从 [模型与权限](#models) 确认可使用的模型和对应接口。
3. 根据需求进入文本、图片、视频或音频的能力文档。

::: tip
模型可用性由账号、分组和 API Key 权限共同决定。请始终以 `GET /v1/models` 的实际返回结果为准。
:::

<div id="quickstart"></div>

## 快速接入

<!--@include: ./quickstart.md{7,}-->

<div id="models"></div>

## 模型与权限

<!--@include: ./models.md{7,}-->

<div id="text"></div>

## 文本聊天

<!--@include: ./text.md{7,}-->

<div id="images"></div>

## 图片生成与编辑

<!--@include: ./images.md{7,}-->

<div id="videos"></div>

## 视频生成

<!--@include: ./videos.md{7,}-->

<div id="assets"></div>

## 上传参考素材

<!--@include: ./assets.md{7,}-->

<div id="audio"></div>

## 音频

<!--@include: ./audio.md{7,}-->

<div id="troubleshooting"></div>

## 常见错误

<!--@include: ./troubleshooting.md{7,}-->

<div id="relay"></div>

## 二次中转注意事项

<!--@include: ./relay.md{7,}-->
