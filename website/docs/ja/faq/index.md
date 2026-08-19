# よくある質問

## API Key はどこで取得できますか？

SilicoGrove コンソールで作成し、サーバー側だけに保存してください。リクエストには `Authorization: Bearer YOUR_API_KEY` を使用します。

## 利用可能なモデルを確認するには？

同じ API Key で `GET https://ai.silicogrove.com/v1/models` を呼び出します。

## 動画タスクはどのように処理しますか？

動画生成は非同期です。`task_id` を保存して完了まで確認し、`/content` から動画をダウンロードします。

詳しくは[英語 FAQ](/faq/)を参照してください。
