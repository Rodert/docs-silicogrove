---
class: api-page
---

# 上传参考素材

本地图片、视频和音频可先上传到临时素材接口。该接口接受 API Key（也接受游乐场登录态），因此 API 客户端可先上传本地文件，再将返回的 `data.url` 放入后续请求。

上传成功后的 `data.url` 可直接放入视频请求中的 `images`、`videos` 或 `audios` 数组；也可作为 Gemini OpenAI 兼容改图请求的 JSON 图片引用。

::: warning 临时文件会定期清理
上传素材和生成结果均为临时文件，系统会定期清理，链接可能失效。请在使用或任务完成后尽快下载并自行保存；请勿将返回链接作为长期存储地址。
:::

## 上传文件

```bash
# 上传图片
curl -X POST "https://ai.silicogrove.com/pg/assets" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "kind=image" \
  -F "file=@/path/to/ref.jpg"

# 上传视频
curl -X POST "https://ai.silicogrove.com/pg/assets" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "kind=video" \
  -F "file=@/path/to/ref.mp4"

# 上传音频
curl -X POST "https://ai.silicogrove.com/pg/assets" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "kind=audio" \
  -F "file=@/path/to/ref.mp3"
```

## 返回示例

```json
{
  "success": true,
  "data": {
    "kind": "image",
    "url": "https://file.lunadownload.com/temporary/2026/08/11/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg",
    "filename": "ref.jpg",
    "content_type": "image/jpeg",
    "size": 123456
  }
}
```

| `kind` | 文件类型 | 单文件大小 |
| --- | --- | --- |
| `image` | jpg、png、webp | 最多 10 MiB |
| `video` | mp4、mov、webm | 最多 100 MiB |
| `audio` | mp3、m4a、wav、aac、ogg、webm | 最多 20 MiB |
