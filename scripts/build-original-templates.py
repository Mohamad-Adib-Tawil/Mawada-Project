"""Rebuild original visual variants without restoring obsolete demo names/code.

The pre-redesign Git revision supplies only raster and video media. Current
template HTML, scripts, adapter, sound, and motion layers remain the safe,
maintained implementation in both variants.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REVISION = "e8db266"
MEDIA_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4"}
CURRENT = ROOT / "public" / "templates"
ORIGINAL = ROOT / "public" / "templates-original"
COVERS = ROOT / "public" / "assets" / "templates"
ORIGINAL_COVERS = ROOT / "public" / "assets" / "templates-original"
MEDIA_OVERRIDE_MANIFEST = ROOT / "design" / "original-media-overrides.json"


def git_blob(relative: Path) -> bytes | None:
    result = subprocess.run(
        ["git", "show", f"{SOURCE_REVISION}:{relative.as_posix()}"],
        cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=False,
    )
    return result.stdout if result.returncode == 0 else None


def restore_media(source: Path, destination: Path, included: set[str] | None = None) -> tuple[int, list[str]]:
    restored = 0
    missing: list[str] = []
    for file in source.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in MEDIA_EXTENSIONS:
            continue
        relative_name = file.relative_to(source).as_posix()
        if included is not None and relative_name not in included:
            continue
        blob = git_blob(file.relative_to(ROOT))
        if blob is None:
            missing.append(file.relative_to(ROOT).as_posix())
            continue
        target = destination / relative_name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(blob)
        restored += 1
    return restored, missing


def main() -> None:
    template_ids = {item["id"] for item in json.loads((ROOT / "src" / "config" / "site-data.json").read_text())["templates"]}
    actual_ids = {path.name for path in CURRENT.iterdir() if path.is_dir()}
    if template_ids != actual_ids:
        raise RuntimeError(f"Catalog and template directories differ: {template_ids ^ actual_ids}")
    if ORIGINAL.exists() or ORIGINAL_COVERS.exists():
        raise RuntimeError("Original variant output already exists; remove or move it deliberately before rebuilding.")
    shutil.copytree(CURRENT, ORIGINAL)
    ORIGINAL_COVERS.mkdir(parents=True)
    catalog = json.loads((ROOT / "src" / "config" / "site-data.json").read_text())["templates"]
    selected_covers: set[str] = set()
    for template in catalog:
        for field in ("cover", "hero"):
            current_path = ROOT / "public" / template[field].lstrip("/")
            relative = current_path.relative_to(COVERS)
            selected_covers.add(relative.as_posix())
            original_path = ORIGINAL_COVERS / relative
            original_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(current_path, original_path)
    restored_templates, missing_templates = restore_media(CURRENT, ORIGINAL)
    restored_covers, missing_covers = restore_media(COVERS, ORIGINAL_COVERS, selected_covers)
    overrides = json.loads(MEDIA_OVERRIDE_MANIFEST.read_text())
    for item in overrides:
        source = ROOT / "public" / item["source"]
        target = ROOT / "public" / item["target"]
        if not source.is_file() or not target.is_file():
            raise FileNotFoundError(f"Invalid original media override: {item}")
        shutil.copy2(source, target)
    print(f"Applied {len(overrides)} text-free media replacements to avoid restoring names and dates baked into images.")
    print(f"Restored {restored_templates} original template media and {restored_covers} original catalog images.")
    print(f"Current-only media kept in the original variants: {len(missing_templates) + len(missing_covers)}")
    for path in missing_templates + missing_covers:
        print(f"  {path}")


if __name__ == "__main__":
    main()
