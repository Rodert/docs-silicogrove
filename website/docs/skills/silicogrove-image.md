---
class: skills-page
---

# SilicoGrove Image

Copy the following text and send it to Codex or another AI agent that supports `SKILL.md`.

```text
Please install and use this Silico Grove Image Skill:
https://github.com/Rodert/silicogrove-image-skill

Clone the Git repository and preserve its .git directory. Before every use, run git pull --ff-only origin main in the installed skill directory, then re-read SKILL.md before handling my request. If updating is unavailable or cannot fast-forward safely, use the installed version without overwriting local changes.

On first use, proactively ask me for my Silico Grove API Key and save it securely in the local configuration for future use. Do not require me to configure an environment variable manually.

Generate directly from text when I only provide an image description. Ask me to upload a file only when I ask to edit an image or use an image reference. Use a public http(s) image URL directly when I provide one.

For requests, prefer https://ai.silicogrove.com. If it has a network error, timeout, or returns 404, automatically use https://api.silicogrove.com instead.

Usage documentation:
https://docs.silicogrove.com/api/#images
```

After it is installed, you can simply ask your AI: `Generate a clean, premium product photograph of a wireless speaker on a white studio background.`

[View source on GitHub](https://github.com/Rodert/silicogrove-image-skill)
