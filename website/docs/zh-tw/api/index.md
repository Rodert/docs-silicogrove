---
class: api-page
---

# API 文件

SilicoGrove API 支援文字、圖片、影片與音訊能力。所有可用模型與權限請以 `GET /v1/models` 的回應為準。

## 快速開始

影片生成使用 `POST /v1/videos`，目前可用的影片範例模型為 `kling-video-v3`。建立任務後保存 `task_id`，再輪詢任務狀態並透過受鑑權的 `/content` 下載結果。

完整的 endpoint、請求欄位與 cURL 範例請參考[英文 API 文件](/api/)。
