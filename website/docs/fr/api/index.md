---
class: api-page
---

# API

L’API SilicoGrove prend en charge le texte, les images, la vidéo et l’audio. Les modèles et droits disponibles sont ceux renvoyés par `GET /v1/models`.

La génération vidéo utilise `POST /v1/videos`. Le modèle recommandé est `grok-video-1.5` ; `seconds` accepte uniquement `6`, `8`, `10`, `12` ou `15`. Conservez le `task_id` retourné et suivez son état.

Consultez la[documentation API en anglais](/api/) pour les endpoints, champs et exemples cURL complets.
