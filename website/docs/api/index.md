---
class: api-page
outline: false
---

<div id="overview"></div>

# Silico Grove API Integration Guide

Integrate text, image, video, and audio capabilities through the endpoint matching each feature. Preserve request field names exactly.

| Item | Value |
| --- | --- |
| Primary Base URL | `https://ai.silicogrove.com/v1` |
| Backup Base URL | `https://api.silicogrove.com/v1` when the primary domain is unavailable |
| Authentication | `Authorization: Bearer YOUR_API_KEY` |
| JSON requests | `Content-Type: application/json` |
| File uploads | `multipart/form-data` |

Start with [Quick start](#quickstart), then confirm access in [Models and access](#models).

<div id="quickstart"></div>

## Quick Start

<!--@include: ./quickstart.md{7,}-->

<div id="models"></div>

## Models and Access

<!--@include: ./models.md{7,}-->

<div id="text"></div>

## Text

<!--@include: ./text.md{7,}-->

<div id="images"></div>

## Images

<!--@include: ./images.md{7,}-->

<div id="videos"></div>

## Video

<!--@include: ./videos.md{7,}-->

<div id="assets"></div>

## Reference Assets

<!--@include: ./assets.md{7,}-->

<div id="audio"></div>

## Audio

<!--@include: ./audio.md{7,}-->

<div id="troubleshooting"></div>

## Troubleshooting

<!--@include: ./troubleshooting.md{7,}-->

<div id="relay"></div>

## Relay Integrations

<!--@include: ./relay.md{7,}-->
