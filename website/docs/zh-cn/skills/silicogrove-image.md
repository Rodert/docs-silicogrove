---
class: skills-page
---

# SilicoGrove Image

复制下面整段文字，发送给 Codex 或其他支持 `SKILL.md` 的 AI Agent：

```text
请安装并使用这个 Silico Grove 生图 Skill：
https://github.com/Rodert/silicogrove-image-skill

请通过 Git 克隆安装并保留 .git 目录。每次使用前，请在已安装的 skill 目录执行 git pull --ff-only origin main；若有更新，请重新读取 SKILL.md 后再处理我的请求。若无法更新或无法安全快进，请保留本地改动并使用当前已安装版本。

首次使用时请主动提示我输入 Silico Grove API Key，并自动安全保存到本机配置中，之后直接读取使用；不要要求我手动配置环境变量。

当我只提供图片描述时，直接生成图片。只有当我要求编辑图片或使用参考图时，才提示我上传文件；如果我提供公网 http(s) 图片链接，请直接使用该链接。

请求优先使用 https://ai.silicogrove.com；如果网络不通、超时或返回 404，请自动切换到 https://api.silicogrove.com。

使用文档：
https://docs.silicogrove.com/zh-cn/api/#images
```

安装完成后，直接对 AI 说：`生成一张高级简洁的无线音箱产品摄影图，白色影棚背景，真实质感。`

[查看 GitHub 源码](https://github.com/Rodert/silicogrove-image-skill)
