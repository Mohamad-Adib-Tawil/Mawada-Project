"""Render template MP4s with an animated artwork opening and reference color grade.

The original footage supplies the existing scene motion and soundtrack. Its
pre-visual-update Git revision is the immutable input for repeatable renders.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REVISION = "79d0d9ef4cce97d8ff056e4ddd0de3a016ad80fd"


def run(*args: str) -> bytes:
    return subprocess.check_output(args, cwd=ROOT)


def reference_grade(original: Path, artwork: Path, duration: float) -> str:
    frame = run(
        "ffmpeg", "-loglevel", "error", "-ss", str(duration / 2), "-i", str(original),
        "-frames:v", "1", "-vf", "scale=64:64", "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
    )
    source = Image.frombytes("RGB", (64, 64), frame)
    with Image.open(artwork) as image:
        reference = image.convert("RGB").resize((64, 64))

    def percentile(values: list[int], percent: int) -> int:
        return sorted(values)[round((len(values) - 1) * percent / 100)]

    channels = []
    for index, name in enumerate("rgb"):
        source_values = [pixel[index] for pixel in source.getdata()]
        target_values = [pixel[index] for pixel in reference.getdata()]
        s10, s50, s90 = (percentile(source_values, p) for p in (10, 50, 90))
        t10, t50, t90 = (percentile(target_values, p) for p in (10, 50, 90))
        lower = round(max(.7, min(1.3, (t50 - t10) / max(s50 - s10, 1))), 3)
        upper = round(max(.7, min(1.3, (t90 - t50) / max(s90 - s50, 1))), 3)
        midpoint = round(s50 + max(-30, min(30, t50 - s50)))
        mapped = f"if(lt(val,{s50}),{midpoint}+(val-{s50})*{lower},{midpoint}+(val-{s50})*{upper})"
        channels.append(f"{name}='clip(0.4*val+0.6*({mapped}),0,255)'")
    return "lutrgb=" + ":".join(channels)


def render(target: Path) -> None:
    template_id = target.relative_to(ROOT).parts[2]
    artwork = ROOT / "design" / "masters" / f"{template_id}.webp"
    opening_artwork = artwork
    if template_id == "wedding-temp-bab" and target.name == "door.mp4":
        opening_artwork = ROOT / "design" / "masters" / "video" / "wedding-temp-bab-door-closed.webp"
    if template_id == "wedding-temp-2":
        opening_artwork = ROOT / "design" / "masters" / "video" / "wedding-temp-2-closed.webp"
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
        grade = reference_grade(original, artwork, duration)
        filters = (
            f"[0:v]fps=30,scale={width}:{height},setsar=1,"
            f"{grade},format=rgba[base];"
            f"[1:v]scale={round(width * 1.08)}:{round(height * 1.08)}:force_original_aspect_ratio=increase,"
            f"crop={width}:{height}:x='(in_w-out_w)/2+sin(t*0.8)*(in_w-out_w)/4':"
            f"y='(in_h-out_h)/2+cos(t*0.6)*(in_h-out_h)/4',"
            "format=rgba,fade=t=out:st=0.35:d=1.25:alpha=1[opening];"
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
