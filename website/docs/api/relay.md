---
class: api-page
---

# Relay Integrations

- Use `https://ai.silicogrove.com` or `https://ai.silicogrove.com/v1` as the primary upstream, depending on whether your relay adds `/v1` automatically.
- The backup upstream is `https://api.silicogrove.com` or `https://api.silicogrove.com/v1`; configure failover in the relay.
- Synchronize `/v1/models` with a Silico Grove API key rather than entering unavailable models manually.
- Video models must stay on `/v1/videos`; do not add them to a chat model pool.
- Preserve the `images`, `videos`, and `audios` arrays when forwarding video requests.
- Image editing and audio transcription are multipart requests; do not lose their file fields during forwarding.
- Submit asynchronous images to `POST /v1/images/tasks` and poll `GET /v1/images/tasks/{task_id}`; do not wrap an asynchronous task as a synchronous image response.
