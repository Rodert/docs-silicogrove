---
class: skills-page
---

# SilicoGrove Image

复制下面整段文字，发送给 Codex 或其他支持 `SKILL.md` 的 AI Agent：

```text
请安装并使用这个 Silico Grove 生图 Skill：
https://github.com/Rodert/silicogrove-image-skill

如果本机无法通过 Git 克隆，请自动采用可用的安装方式完成 Skill 安装；不要要求我手动克隆、配置环境变量或处理依赖。

首次使用时请主动提示我输入 Silico Grove API Key，并自动安全保存到本机配置中，之后直接读取使用；不要要求我手动配置环境变量。

当我只提供图片描述时，直接生成图片。只有当我要求编辑图片或使用参考图时，才提示我上传文件；如果我提供公网 http(s) 图片链接，请直接使用该链接。

请使用异步图片任务；任务完成后，请将结果下载到我的本地输出目录，并告知本地文件路径，而不只是展示图片链接。

每次 generate 或 edit 请求前，请检查已安装 Skill 的上游 Git 更新。没有更新时静默继续；发现更新且本地检出干净时，先快进更新，再重新读取 SKILL.md 后发起图片请求，并明确提示更新可能包含必要的修复。检查或更新失败，或本地修改阻止更新时，请提示我且不要发起请求；绝不覆盖本地修改。

请为所选模型使用其所属公司对应分组的 API Key。不要假定控制台分组名称固定；确认所选模型对已保存的 Key 可用。若生图失败，请提示我检查该公司对应分组的 Key、模型权限和余额。

请求优先使用 https://ai.silicogrove.com；如果网络不通、超时或返回 404，请自动切换到 https://api.silicogrove.com。

使用文档：
https://docs.silicogrove.com/zh-cn/api/#images
```

安装完成后，直接对 AI 说：`生成一张高级简洁的无线音箱产品摄影图，白色影棚背景，真实质感。`

[查看 GitHub 源码](https://github.com/Rodert/silicogrove-image-skill)
