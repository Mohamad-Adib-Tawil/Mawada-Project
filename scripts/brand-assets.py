"""Build Mawada display assets from approved generated artwork.

This script is intentionally not used at runtime. See docs/visual-assets.md for
the source artwork and regenerate only when those source files are available.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "design" / "masters"
PUBLIC = ROOT / "public" / "assets"


def save_jpeg(source: Image.Image, destination: Path, size: tuple[int, int]) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    ImageOps.fit(source.convert("RGB"), size, method=Image.Resampling.LANCZOS).save(
        destination, "JPEG", quality=88, optimize=True, progressive=True
    )


def refresh_template_stills(template_id: str, artwork: Image.Image) -> None:
    """Replace static cover/poster/share surfaces while leaving motion media intact."""
    template_dir = ROOT / "public" / "templates" / template_id
    for target in template_dir.rglob("*"):
        if not target.is_file() or target.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        name = target.stem.lower()
        if any(word in name for word in ("original", "previous", "favicon")):
            continue
        if not any(word in name for word in ("share", "social-preview", "poster", "hero")):
            continue
        selected_artwork = artwork
        if template_id == "wedding-temp-bab" and name == "door-poster":
            selected_artwork = Image.open(SOURCE / "video" / "wedding-temp-bab-door-closed.webp")
        with Image.open(target) as current:
            size = current.size
        refreshed = ImageOps.fit(selected_artwork, size, method=Image.Resampling.LANCZOS)
        if target.suffix.lower() in {".jpg", ".jpeg"}:
            refreshed.save(target, "JPEG", quality=88, optimize=True, progressive=True)
        elif target.suffix.lower() == ".webp":
            refreshed.save(target, "WEBP", quality=88, method=6)
        else:
            refreshed.save(target, "PNG", optimize=True)


def refresh_gallery_stills(template_id: str) -> None:
    source_dir = SOURCE / "gallery" / template_id
    if not source_dir.exists():
        return
    template_dir = ROOT / "public" / "templates" / template_id
    for source in sorted(source_dir.glob("*.webp")):
        index = source.stem
        if template_id == "wedding-temp-disney":
            targets = [template_dir / "images" / f"{index}.jpg"]
        elif template_id in {"wedding-temp-blush", "wedding-temp-rozana"}:
            targets = [template_dir / "assets" / f"mem{index}.jpg"]
        else:
            targets = list(template_dir.glob(f"**/gallery/{index}.jpg"))
        if len(targets) != 1 or not targets[0].exists():
            raise ValueError(f"Expected one gallery target for {template_id}/{index}: {targets}")
        with Image.open(targets[0]) as current:
            size = current.size
        with Image.open(source) as artwork:
            save_jpeg(artwork, targets[0], size)


INTERIOR_STILLS = {
    "simple-invide-merrage": {
        "assets/images/reference/ceremonial-doors.jpg": "@bab-door",
        "assets/images/reference/floral-arch.jpg": "@wedding-arch",
    },
    "wedding-temp-royal": {
        "templates/royal/assets/curtain.jpg": "curtain",
        "templates/royal/assets/curtain.webp": "curtain",
    },
    "wedding-temp-ring": {"assets/box-open.jpg": "box-open"},
    "wedding-temp-laylat-hana": {"images/couple.webp": "couple"},
    "wedding-temp-bahira": {"assets/painting.webp": "painting"},
    "wedding-temp-qasr": {"assets/couple.jpg": "couple", "assets/garden.jpg": "garden"},
    "wedding-temp-blush": {"assets/garden.jpg": "garden"},
    "wedding-temp-letter": {"templates/letter/assets/letter-open.jpg": "letter-open"},
    "wedding-temp-dove": {"assets/end.jpg": "end"},
    "wedding-temp-2": {
        "new_assets/cover-bride.webp": "bride",
        "new_assets/hall-facing.webp": "bride",
        "new_assets/hall-facing-wide.webp": "bride",
        "new_assets/hall-black-tux.webp": "hall-wide",
        "new_assets/hall-wide.webp": "hall-wide",
        "new_assets/thurayya-hall-tux.webp": "hall-wide",
        "new_assets/thurayya-hall-tux-wide.webp": "hall-wide",
        "new_assets/thurayya-hall-tux-wide-v2.webp": "hall-wide",
        "new_assets/invitation-paper.webp": "paper",
        "new_assets/thurayya-floor.jpg": "hall-wide",
    },
}


def refresh_interior_stills(template_id: str, artwork: Image.Image) -> None:
    template_dir = ROOT / "public" / "templates" / template_id
    targets = dict(INTERIOR_STILLS.get(template_id, {}))
    if template_id == "qabda":
        targets["images/demo-photo.jpg"] = "__cover__"
    elif template_id == "neon":
        targets["assets/scene.jpg"] = "__cover__"
    elif template_id == "wedding-temp-reverie":
        targets["assets/envelope.jpg"] = "__cover__"
    elif template_id == "wedding-temp-surprise":
        targets["assets/jerry-ready-pause.jpg"] = "__cover__"
    for relative, source_name in targets.items():
        target = template_dir / relative
        if not target.exists():
            raise FileNotFoundError(target)
        if source_name == "__cover__":
            selected = artwork
        elif source_name == "@bab-door":
            selected = Image.open(SOURCE / "video" / "wedding-temp-bab-door-closed.webp")
        elif source_name == "@wedding-arch":
            selected = Image.open(SOURCE / "wedding.webp")
        else:
            selected = Image.open(SOURCE / "interior" / template_id / f"{source_name}.webp")
        with Image.open(target) as current:
            size = current.size
        refreshed = ImageOps.fit(selected, size, method=Image.Resampling.LANCZOS)
        if target.suffix.lower() == ".webp":
            refreshed.save(target, "WEBP", quality=88, method=6)
        else:
            refreshed.save(target, "JPEG", quality=88, optimize=True, progressive=True)


def build() -> None:
    catalog = json.loads((ROOT / "src" / "config" / "site-data.json").read_text())
    logo = Image.open(SOURCE / "mawada-mark.png").convert("RGB")
    save_jpeg(logo, PUBLIC / "brand" / "instagram-profile.jpg", (1080, 1080))
    save_jpeg(logo, PUBLIC / "brand" / "mark.jpg", (512, 512))

    mark = ImageOps.fit(logo, (150, 150), method=Image.Resampling.LANCZOS)
    for template in catalog["templates"]:
        template_id = template["id"]
        artwork = Image.open(SOURCE / f"{template_id}.webp").convert("RGB")
        for key in ("cover", "hero"):
            target = ROOT / "public" / template[key].lstrip("/")
            existing_size = Image.open(target).size
            save_jpeg(artwork, target, existing_size)

        refresh_template_stills(template_id, artwork)
        refresh_gallery_stills(template_id)
        refresh_interior_stills(template_id, artwork)

        post = ImageOps.fit(artwork, (1080, 1080), method=Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(post, "RGBA")
        draw.rounded_rectangle((850, 850, 1040, 1040), radius=54, fill=(255, 250, 246, 244))
        post.paste(mark, (870, 870))
        output = PUBLIC / "instagram" / f"{template_id}.jpg"
        output.parent.mkdir(parents=True, exist_ok=True)
        post.save(output, "JPEG", quality=91, optimize=True, progressive=True)


if __name__ == "__main__":
    build()
