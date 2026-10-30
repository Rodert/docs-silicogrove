---
class: api-page
---

# Text

<p class="api-section-description">Send text or supported multimodal content through the chat API to receive model responses.</p>

## Chat Completions

```bash
curl -X POST "https://ai.silicogrove.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5.4-mini","messages":[{"role":"system","content":"You are a concise assistant."},{"role":"user","content":"Write a product introduction."}],"stream":false}'
```

## Responses API

```bash
curl -X POST "https://ai.silicogrove.com/v1/responses" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5.4-mini","input":"Introduce yourself in one sentence."}'
```
