---
class: api-page
---

# Quick Start

1. Create and securely store an API key in the console.
2. List the models available to that key.
3. Send requests to the matching capability endpoint.

::: warning Do not duplicate the Base URL
The OpenAI SDK `base_url` includes `/v1`. Do not append `/v1` again when composing complete endpoint URLs. The backup address requires client-side failover configuration.
:::

## List available models

```bash
curl -X GET "https://ai.silicogrove.com/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Minimal text request

```bash
curl -X POST "https://ai.silicogrove.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5.4-mini","messages":[{"role":"user","content":"Hello, reply in one sentence."}]}'
```

## Python OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY", base_url="https://ai.silicogrove.com/v1")
response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[{"role": "user", "content": "Hello, reply in one sentence."}],
)
print(response.choices[0].message.content)
```
