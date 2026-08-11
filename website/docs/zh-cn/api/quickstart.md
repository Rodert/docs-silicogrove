---
class: api-page
---

# 快速接入

1. 在控制台创建并妥善保存 API Key。
2. 用该 Key 查询可用模型，确认权限。
3. 为不同能力调用对应接口，视频和图片接口不可混用。

::: warning Base URL 不要重复拼接
首选地址用于日常调用和大流量请求；备用地址需要由调用方配置故障切换。OpenAI SDK 的 `base_url` 应包含 `/v1`，自行拼接完整路径时不要重复添加 `/v1`。
:::

## 查询可用模型

```bash
curl -X GET "https://ai.silicogrove.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 最小文本测试

```bash
curl -X POST "https://ai.silicogrove.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [{"role": "user", "content": "你好，用一句话回复我"}]
  }'
```

## Python OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://ai.silicogrove.com/v1",
)

response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[{"role": "user", "content": "你好，用一句话回复我"}],
)
print(response.choices[0].message.content)
```
