---
class: api-page
---

# API ドキュメント

SilicoGrove API はテキスト、画像、動画、音声に対応しています。利用可能なモデルと権限は `GET /v1/models` のレスポンスを確認してください。

動画生成は `POST /v1/videos` を使用します。現在の動画例では `kling-video-v3` を使用し、返された `task_id` を保存して状態を確認します。

endpoint、フィールド、cURL の詳細は[英語 API ドキュメント](/api/)を参照してください。
