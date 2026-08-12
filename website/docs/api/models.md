---
class: api-page
---

# Models and Access

Available models depend on your account, group, and API key permissions. Treat `GET /v1/models` as the source of truth.

| Capability | Typical models | Endpoint |
| --- | --- | --- |
| Text | `gpt-5.4-mini`, Claude, Gemini | `/v1/chat/completions` |
| Images | `gpt-image-2`, Gemini image models, `grok-imagine-image` | Sync `/v1/images/generations`; async `/v1/images/tasks` |
| Video | `video-ds-2.0`, `as-sd2.0-fast` | `/v1/videos` |
| Audio | Check the returned model list | `/v1/audio/*` |
