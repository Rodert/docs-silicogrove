---
class: api-page
---

# 文本聊天

## Chat Completions

```bash
curl -X POST "https://ai.silicogrove.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [
      {"role": "system", "content": "你是一个简洁的助手"},
      {"role": "user", "content": "写一句产品介绍"}
    ],
    "stream": false
  }'
```

## Responses API

```bash
curl -X POST "https://ai.silicogrove.com/v1/responses" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-5.4-mini", "input": "用一句话介绍你自己"}'
```
