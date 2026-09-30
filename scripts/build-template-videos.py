"""Render color-matched template MP4s with the new artwork as bookends.

The original footage supplies the existing scene motion and soundtrack. Its
pre-visual-update Git revision is the immutable input for repeatable renders.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageStat


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REVISION = "79d0d9ef4cce97d8ff056e4ddd0de3a016ad80fd"


def run(*args: str) -> bytes:
    return subprocess.check_output(args, cwd=ROOT)


def color_ratios(original: Path, artwork: Path, duration: float) -> tuple[float, float, float]:
    frame = run(
        "ffmpeg", "-loglevel", "error", "-ss", str(duration / 2), "-i", str(original),
        "-frames:v", "1", "-vf", "scale=64:64", "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
    )
    source_means = ImageStat.Stat(Image.frombytes("RGB", (64, 64), frame)).mean
    with Image.open(artwork) as image:
        desired_means = ImageStat.Stat(image.convert("RGB").resize((64, 64))).mean
    return tuple(round(max(.90, min(1.10, desired / max(original, 1))), 3)
                 for original, desired in zip(source_means, desired_means))


def render(target: Path) -> None:
    template_id = target.relative_to(ROOT).parts[2]
    artwork = ROOT / "design" / "masters" / f"{template_id}.webp"
    opening_artwork = artwork
    if template_id == "wedding-temp-bab" and target.name == "door.mp4":
        opening_artwork = ROOT / "design" / "masters" / "video" / "wedding-temp-bab-door-closed.webp"
    if not artwork.exists():
        raise FileNotFoundError(artwork)
    relative = target.relative_to(ROOT).as_posix()
    original = ROOT / "design" / ".video-temp-source.mp4"
    output = target.with_name(target.stem + ".mawada-render.mp4")
    with original.open("wb") as stream:
        subprocess.run(["git", "show", f"{SOURCE_REVISION}:{relative}"], cwd=ROOT,
                       stdout=stream, check=True)
    try:
        metadata = json.loads(run("ffprobe", "-v", "error", "-show_entries",
                                  "format=duration:stream=codec_type,width,height", "-of", "json", str(original)))
        duration = float(metadata["format"]["duration"])
        video = next(stream for stream in metadata["streams"] if stream["codec_type"] == "video")
        width, height = video["width"], video["height"]
        r, g, b = color_ratios(original, artwork, duration)
        filters = (
            f"[0:v]fps=30,scale={width}:{height},setsar=1,"
            f"colorchannelmixer=rr={r}:gg={g}:bb={b},format=rgba[base];"
            f"[1:v]scale={width}:{height}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height},format=rgba,fade=t=out:st=0:d=1:alpha=1[opening];"
            "[base][opening]overlay=shortest=1:format=auto,format=yuv420p[v]"
        )
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(original),
            "-loop", "1", "-framerate", "30", "-t", str(duration), "-i", str(opening_artwork),
            "-filter_complex", filters, "-map", "[v]", "-map", "0:a?",
            "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
            "-c:a", "copy", "-t", str(duration), "-movflags", "+faststart", str(output),
        ], cwd=ROOT, check=True)
        os.replace(output, target)
        print(f"Rendered {relative} ({duration:.2f}s, {width}x{height})")
    finally:
        original.unlink(missing_ok=True)
        output.unlink(missing_ok=True)


def main() -> None:
    paths = sorted((ROOT / "public" / "templates").rglob("*.mp4"))
    selected = set(sys.argv[1:])
    for path in paths:
        if not selected or path.relative_to(ROOT).as_posix() in selected:
            render(path)


if __name__ == "__main__":
    main()
