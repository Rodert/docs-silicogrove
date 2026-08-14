---
class: skills-page
---

# SilicoGrove Video

复制下面整段文字，发送给 Codex 或其他支持 `SKILL.md` 的 AI Agent：

```text
请安装并使用这个 Silico Grove 视频生成 Skill：
https://github.com/Rodert/silicogrove-video-skill

如果本机无法通过 Git 克隆，请自动采用可用的安装方式完成 Skill 安装；不要要求我手动克隆、配置环境变量或处理依赖。

首次使用时请主动提示我输入 Silico Grove API Key，并自动安全保存到本机配置中，之后直接读取使用；不要要求我手动配置环境变量。

当我只提供视频描述时，直接生成文生视频。只有当我要求编辑视频或使用图片、视频或音频参考素材时，才提示我上传文件；如果我提供公网 http(s) 素材链接，请直接使用该链接。

请使用异步视频任务；任务完成后，请将结果下载到我的本地输出目录，并告知本地文件路径，而不只是展示视频链接。

每次 generate 或 edit 请求前，请检查已安装 Skill 的上游 Git 更新。没有更新时静默继续；发现更新且本地检出干净时，先快进更新，再重新读取 SKILL.md 后发起视频请求，并明确提示更新可能包含必要的修复。检查或更新失败，或本地修改阻止更新时，请提示我且不要发起请求；绝不覆盖本地修改。

请为所选模型使用其所属公司对应分组的 API Key。不要假定控制台分组名称固定；确认所选模型对已保存的 Key 可用。若生成失败，请提示我检查该公司对应分组的 Key、模型权限和余额。

请求优先使用 https://ai.silicogrove.com；如果网络不通、超时或返回 404，请自动切换到 https://api.silicogrove.com。

使用文档：
https://docs.silicogrove.com/zh-cn/api/#videos
```

安装完成后，直接对 AI 说：`生成一个 9:16 的银色咖啡机产品视频，镜头缓慢环绕，早晨光线，真实质感。`

[查看 GitHub 源码](https://github.com/Rodert/silicogrove-video-skill)
