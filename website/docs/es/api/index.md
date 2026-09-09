---
class: api-page
---

# API

La API de SilicoGrove admite texto, imágenes, vídeo y audio. Los modelos y permisos disponibles son los que devuelve `GET /v1/models`.

La generación de vídeo usa `POST /v1/videos`. El modelo recomendado es `grok-video-1.5`; `seconds` solo acepta `6`, `8`, `10`, `12` o `15`. Guarda el `task_id` devuelto y consulta su estado.

Consulta la[documentación de API en inglés](/api/) para ver endpoints, campos y ejemplos cURL completos.
