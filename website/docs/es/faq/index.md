# Preguntas frecuentes

## ¿Cómo obtengo una API Key?

Crea una clave en la consola de SilicoGrove y guárdala solo en el servidor. En las llamadas usa `Authorization: Bearer YOUR_API_KEY`.

## ¿Cómo compruebo los modelos disponibles?

Llama a `GET https://ai.silicogrove.com/v1/models` con la misma clave.

## ¿Cómo proceso una tarea de vídeo?

La generación de vídeo es asíncrona. Guarda el `task_id`, consulta la tarea hasta que termine y descarga el vídeo mediante `/content`.

Consulta las[FAQ en inglés](/faq/) para más respuestas.
