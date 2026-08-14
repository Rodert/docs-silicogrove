---
class: skills-page
---

# SilicoGrove Video

Copy the following text and send it to Codex or another AI agent that supports `SKILL.md`.

```text
Please install and use this Silico Grove Video Skill:
https://github.com/Rodert/silicogrove-video-skill

If Git cloning is unavailable on this machine, automatically use an available installation method to install the Skill. Do not require me to clone the repository, configure environment variables, or resolve dependencies manually.

On first use, proactively ask me for my Silico Grove API Key and save it securely in the local configuration for future use. Do not require me to configure an environment variable manually.

Generate directly from text when I only provide a video description. Ask me to upload a file only when I ask to edit a video or use an image, video, or audio reference. Use a public http(s) reference URL directly when I provide one.

Use asynchronous video tasks. When the task is complete, download the result to my local output directory and tell me its local file path instead of only showing a video URL.

Before every generate or edit request, check the installed Skill for upstream Git updates. Continue silently when there is no update. When an update is available and the local checkout is clean, fast-forward it, re-read SKILL.md, then make the video request, explicitly noting that the update may contain required fixes. If the check or update fails, or local changes prevent an update, tell me and do not make the request. Never overwrite local changes.

For the selected model, use the API Key from the corresponding company group. Do not assume fixed console group names; verify the saved Key can access the selected model. If video generation fails, tell me to check the Key, model access, and balance for that company's group.

For requests, prefer https://ai.silicogrove.com. If it has a network error, timeout, or returns 404, automatically use https://api.silicogrove.com instead.

Usage documentation:
https://docs.silicogrove.com/api/#videos
```

After it is installed, you can simply ask your AI: `Generate a 9:16 product video of a silver espresso machine with a slow orbiting camera.`

[View source on GitHub](https://github.com/Rodert/silicogrove-video-skill)
