---
class: skills-page
---

# SilicoGrove Video

`silicogrove-video` is a command-line skill for generating text-to-video and reference-guided video through the SilicoGrove API.

[View the source on GitHub](https://github.com/Rodert/silicogrove-video-skill).

## Before you start

Install the skill according to the repository instructions, then create an API key with access to a video model from the [SilicoGrove API site](https://api.silicogrove.com/keys).

Keep API keys private. Do not put them in prompts, project files, source control, or command-line arguments.

## Check configuration and models

Run these commands from the installed skill directory:

```bash
python3 scripts/silicogrove_video.py config --show-status
python3 scripts/silicogrove_video.py models
```

Select a model visible to your key. Use a duration string such as `5`, `10`, or `15`, with `16:9`, `9:16`, or `1:1` for the aspect ratio.

## Generate a video from text

```bash
python3 scripts/silicogrove_video.py generate \
  --model video-ds-2.0-fast \
  --prompt 'A cinematic 9:16 product video of a silver espresso machine, slow orbiting camera, morning light, realistic, no watermark.' \
  --seconds 10 \
  --aspect-ratio 9:16 \
  --output-dir ./outputs
```

The client waits for completion and writes the generated MP4 into the output directory.

## Generate with reference media

Pass public `http(s)` media URLs directly. Local files passed with `--image`, `--video`, or `--audio` are uploaded as temporary assets before video generation.

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

Temporary uploads expire after 24 hours. Limits are 10 MiB for each image, 100 MiB for each video, and 20 MiB for each audio file. For `video-ds-2.0`, `video-ds-2.0-fast`, and `as-sd2.0-fast`, use at most four images, three videos, and one audio reference.

## Check a submitted task

Add `--no-wait` to return a task ID immediately, then retrieve the completed result later:

```bash
python3 scripts/silicogrove_video.py status TASK_ID --output-dir ./outputs
```

For the API-level request and response reference, see [Video API](/api/#videos).
