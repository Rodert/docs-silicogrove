---
class: skills-page
---

# SilicoGrove Image

Copy the following text and send it to Codex or another AI agent that supports `SKILL.md`.

```text
Please install and use this Silico Grove Image Skill:
https://github.com/Rodert/silicogrove-image-skill

If Git cloning is unavailable on this machine, automatically use an available installation method to install the Skill. Do not require me to clone the repository, configure environment variables, or resolve dependencies manually.

On first use, proactively ask me for my Silico Grove API Key and save it securely in the local configuration for future use. Do not require me to configure an environment variable manually.

Generate directly from text when I only provide an image description. Ask me to upload a file only when I ask to edit an image or use an image reference. Use a public http(s) image URL directly when I provide one.

Use asynchronous image tasks. When the task is complete, download the result to my local output directory and tell me its local file path instead of only showing an image URL.

Before every generate or edit request, check the installed Skill for upstream Git updates. Continue silently when there is no update. When an update is available and the local checkout is clean, fast-forward it, re-read SKILL.md, then make the image request, explicitly noting that the update may contain required fixes. If the check or update fails, or local changes prevent an update, tell me and do not make the request. Never overwrite local changes.

For the selected model, use the API Key from the corresponding company group. Do not assume fixed console group names; verify the saved Key can access the selected model. If image generation fails, tell me to check the Key, model access, and balance for that company's group.

For requests, prefer https://ai.silicogrove.com. If it has a network error, timeout, or returns 404, automatically use https://api.silicogrove.com instead.

Usage documentation:
https://docs.silicogrove.com/api/#images
```

After it is installed, you can simply ask your AI: `Generate a clean, premium product photograph of a wireless speaker on a white studio background.`

[View source on GitHub](https://github.com/Rodert/silicogrove-image-skill)
