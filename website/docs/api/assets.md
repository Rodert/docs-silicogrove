---
class: api-page
---

# 上传参考素材

本地图片、视频和音频可先上传到临时素材接口。上传成功后的 `data.url` 可直接放入视频请求中的 `images`、`videos` 或 `audios` 数组。

::: warning 临时素材的保留时间
临时素材会在 24 小时后自动删除。需要长期保留时，请使用自己的对象存储或 CDN URL。
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
