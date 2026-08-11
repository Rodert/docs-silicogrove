# 常见问题

## 如何获取 API Key？

在 SilicoGrove 控制台创建 API Key 并妥善保管。调用时使用 `Authorization: Bearer YOUR_API_KEY`。

## 如何查询可用模型？

使用准备调用的同一 API Key 请求 `GET https://ai.silicogrove.com/v1/models`。返回的模型列表是权限判断的唯一依据。

## 应该使用哪个 Base URL？

默认使用 `https://ai.silicogrove.com/v1`。如有需要，可在应用中将 `https://api.silicogrove.com/v1` 配置为显式备用地址。

## 为什么模型不可用？

模型可能不属于当前账号、分组或 API Key 权限。请使用该 Key 查询模型列表，并严格使用返回的模型名。

## 为什么视频请求失败？

视频模型必须调用 `POST /v1/videos`，不能调用聊天接口。创建视频会返回任务 ID，需查询任务后再下载结果。

## 可以直接传本地文件作为视频参考素材吗？

不可以。请先上传到临时素材接口，或使用自己的公网对象存储 URL，再将返回 URL 放入 `images`、`videos` 或 `audios` 数组。
