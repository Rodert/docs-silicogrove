# FAQ

## Comment obtenir une API Key ?

Créez-la dans la console SilicoGrove et conservez-la uniquement côté serveur. Utilisez `Authorization: Bearer YOUR_API_KEY`.

## Comment vérifier les modèles disponibles ?

Appelez `GET https://ai.silicogrove.com/v1/models` avec la même clé.

## Comment traiter une tâche vidéo ?

La génération vidéo est asynchrone. Conservez le `task_id`, suivez la tâche jusqu’à son terme, puis téléchargez la vidéo via `/content`.

Consultez la[FAQ en anglais](/faq/) pour plus de réponses.
