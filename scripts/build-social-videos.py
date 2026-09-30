"""Create silent vertical motion posts from the generated template artwork.

Each MP4 uses the same text-free master as its template cover. The subtle
camera movement keeps the files useful as Instagram Reels without baking names
or dates into video frames.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / "design" / "masters"
OUTPUT = ROOT / "public" / "assets" / "instagram" / "videos"
DURATION = 8
FPS = 24


def render(master: Path) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    target = OUTPUT / f"{master.stem}.mp4"
    temp = OUTPUT / f"{master.stem}.render.mp4"
    frames = DURATION * FPS
    filter_graph = (
        "scale=768:1366:force_original_aspect_ratio=increase,"
        "crop=768:1366,"
        f"zoompan=z='min(zoom+0.0006,1.105)':"
        "x='(iw-iw/zoom)/2+sin(on/40)*(iw-iw/zoom)/8':"
        "y='(ih-ih/zoom)/2+cos(on/47)*(ih-ih/zoom)/8':"
        f"d={frames}:s=720x1280:fps={FPS},"
        "fade=t=in:st=0:d=0.35,fade=t=out:st=7.55:d=0.45,"
        "format=yuv420p"
    )
    try:
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(master), "-vf", filter_graph,
            "-frames:v", str(frames), "-c:v", "libx264", "-preset", "medium",
            "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(temp),
        ], cwd=ROOT, check=True)
        temp.replace(target)
        print(target.relative_to(ROOT))
    finally:
        temp.unlink(missing_ok=True)


def main() -> None:
    selected = set(sys.argv[1:])
    for master in sorted(MASTERS.glob("*.webp")):
        if not selected or master.stem in selected:
            render(master)


if __name__ == "__main__":
    main()
