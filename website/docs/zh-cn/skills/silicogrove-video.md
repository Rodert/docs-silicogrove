---
class: skills-page
---

# SilicoGrove Video

`silicogrove-video` 是用于通过 SilicoGrove API 生成文生视频和参考素材引导视频的命令行 Skill。

[查看 GitHub 源码](https://github.com/Rodert/silicogrove-video-skill)。

## 开始前准备

请按仓库说明安装 Skill，并在 [SilicoGrove API 站点](https://api.silicogrove.com/keys) 创建具备视频模型权限的 API Key。

请妥善保管 API Key，不要将其放入提示词、项目文件、代码仓库或命令行参数。

## 检查配置与模型

在已安装 Skill 的目录执行：

```bash
python3 scripts/silicogrove_video.py config --show-status
python3 scripts/silicogrove_video.py models
```

选择该 Key 实际可见的视频模型。时长通常使用 `5`、`10` 或 `15`；画面比例使用 `16:9`、`9:16` 或 `1:1`。

## 文生视频

```bash
python3 scripts/silicogrove_video.py generate \
  --model video-ds-2.0-fast \
  --prompt 'A cinematic 9:16 product video of a silver espresso machine, slow orbiting camera, morning light, realistic, no watermark.' \
  --seconds 10 \
  --aspect-ratio 9:16 \
  --output-dir ./outputs
```

客户端会等待任务完成，并将生成的 MP4 写入输出目录。

## 使用参考素材生成视频

可直接传入公网 `http(s)` 媒体 URL。传入 `--image`、`--video` 或 `--audio` 的本地文件会先上传为临时素材。

```bash
python3 scripts/silicogrove_video.py generate \
  --model video-ds-2.0 \
  --prompt 'Use the person in the image and the motion in the clip; create a natural vertical scene.' \
  --seconds 15 \
  --aspect-ratio 9:16 \
  --image /absolute/path/to/reference.jpg \
  --video /absolute/path/to/motion.mp4 \
  --output-dir ./outputs
```

临时素材会在 24 小时后过期。图片单文件最大 10 MiB，视频最大 100 MiB，音频最大 20 MiB。对于 `video-ds-2.0`、`video-ds-2.0-fast` 和 `as-sd2.0-fast`，最多使用四张图片、三个视频和一个音频参考素材。

## 查询已提交任务

添加 `--no-wait` 可立即获得任务 ID，之后再下载结果：

```bash
python3 scripts/silicogrove_video.py status TASK_ID --output-dir ./outputs
```

接口级请求和返回说明见 [视频 API](/zh-cn/api/#videos)。
