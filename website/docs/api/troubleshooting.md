---
class: api-page
---

# Troubleshooting

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| Model unavailable | The model and group do not match, or the key lacks permission. | Call `/v1/models` with the same key to confirm the model name. |
| `model is required` | A relay renamed the field. | Preserve `model`; do not change it to `model_name`. |
| Video fails or enters a chat model | The request was sent to a chat endpoint. | Call `POST /v1/videos`. |
| Reference asset has no effect | A local path was sent, or the value was not an array. | Send public URLs in `images`, `videos`, or `audios`. |
| Invalid `seconds` type | The duration was sent as a number. | Use a string, such as `"seconds": "15"`. |
| Upload fails | Wrong content type or file field name. | Use `-F` and name the file field `file`. |

When reporting an issue, include request time, model, endpoint, group, request ID, and the error response. Do not share API keys, authorization headers, or sensitive prompts.
