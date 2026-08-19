# 常見問題

## 如何取得 API Key？

請在 SilicoGrove 控制台建立 API Key，並只在伺服器端保存。呼叫時使用 `Authorization: Bearer YOUR_API_KEY`。

## 如何查詢可用模型？

使用相同的 API Key 呼叫 `GET https://ai.silicogrove.com/v1/models`。

## 影片任務要如何處理？

影片生成是非同步任務。建立任務後保存 `task_id`，持續查詢直到完成，再呼叫 `/content` 下載影片。

更多問題請參考[英文 FAQ](/faq/)。
