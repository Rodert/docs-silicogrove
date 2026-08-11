# Frequently Asked Questions

## How do I get an API key?

Create an API key in the SilicoGrove console and keep it private. Send it with `Authorization: Bearer YOUR_API_KEY`.

## How do I check available models?

Call `GET https://ai.silicogrove.com/v1/models` with the same API key you plan to use. The returned list is the source of truth for your permissions.

## Which Base URL should I use?

Use `https://ai.silicogrove.com/v1` by default. Configure `https://api.silicogrove.com/v1` as an explicit backup in your application if needed.

## Why is my model unavailable?

The model may not be available to your account, group, or API key. Check the model list with that key and use the returned model name exactly.

## Why did a video request fail?

Video models must use `POST /v1/videos`, not the chat completions endpoint. Video creation returns a task ID; poll that task before downloading the result.

## Can I send a local file as video reference media?

No. Upload it through the temporary asset endpoint or use your own public object-storage URL, then place the returned URL in the `images`, `videos`, or `audios` array.
