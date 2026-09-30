"""Replace personal names in copied template demo sources with fictional names."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "public" / "templates"
WEDDING_IDS = [
    "wedding", "simple-invide-merrage", "wedding-temp-2", "wedding-temp-ethereal",
    "wedding-temp-bab", "wedding-temp-disney", "wedding-temp-dove", "wedding-temp-garden",
    "wedding-temp-laylat-hana", "wedding-temp-qasr", "wedding-temp-letter",
    "wedding-temp-reverie", "wedding-temp-ring", "wedding-temp-rozana",
    "wedding-temp-starlit", "wedding-temp-dovess", "wedding-temp-swans",
    "wedding-temp-blush", "wedding-temp-surprise", "wedding-temp-royal",
    "wedding-temp-bahira", "wedding-temp-storybook", "wedding-temp-vangogh",
    "wedding-temp-ivory-palace", "wedding-temp-rosegold", "wedding-temp-wisal",
]
COUPLES = [
    ("سليم", "ليان", "Salim", "Layan"), ("آدم", "جنى", "Adam", "Jana"),
    ("ياسر", "ديمة", "Yaser", "Dima"), ("عمر", "تالا", "Omar", "Tala"),
    ("كريم", "ميرا", "Karim", "Mira"), ("رامي", "ريم", "Rami", "Reem"),
    ("نادر", "هالة", "Nader", "Hala"), ("فارس", "ميس", "Fares", "Mais"),
    ("سامر", "رُبى", "Samer", "Ruba"), ("مالك", "هبة", "Malek", "Heba"),
    ("زياد", "ياسمين", "Ziad", "Yasmin"), ("أنس", "لمى", "Anas", "Lama"),
    ("هيثم", "رنا", "Haitham", "Rana"), ("باسل", "ندى", "Basel", "Nada"),
    ("مازن", "فرح", "Mazen", "Farah"), ("مروان", "بيان", "Marwan", "Bayan"),
    ("كنان", "سارة", "Kenan", "Sara"), ("شادي", "غنى", "Shadi", "Ghina"),
    ("قيس", "لين", "Qais", "Leen"), ("أيهم", "نور", "Ayham", "Noor"),
    ("وسيم", "يارا", "Waseem", "Yara"), ("طلال", "شهد", "Talal", "Shahd"),
    ("جواد", "ميساء", "Jawad", "Maysaa"), ("سيف", "لُجين", "Saif", "Lujain"),
    ("أمير", "جود", "Amir", "Joud"), ("عادل", "هنا", "Adel", "Hana"),
]
NEWBORN = {
    "clouds": ("آدم الرفاعي", "Adam Al Rifai", "آدم"),
    "moon": ("إياد النجار", "Iyad Al Najjar", "إياد"),
    "qabda": ("يونس السالم", "Younes Al Salem", "يونس"),
}
TEXT_SUFFIXES = {".html", ".js", ".json", ".css", ".svg", ".ics", ".txt"}


def replace_in_directory(directory: Path, replacements: list[tuple[str, str]]) -> int:
    changed = 0
    for path in directory.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except UnicodeError:
            continue
        updated = original
        for old, new in replacements:
            updated = updated.replace(old, new)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
    return changed


def main() -> None:
    changed = 0
    for template_id, (groom, bride, groom_en, bride_en) in zip(WEDDING_IDS, COUPLES):
        replacements = [
            ("محمد أديب طويل", groom), ("رزان بطايحي", bride),
            ("Mohamad Adib Tawil", groom_en), ("Razan Bataihi", bride_en),
            ("Razan", bride_en), ("رزان", bride),
            ("Mohamad", groom_en), ("محمد", groom),
            ("عائلة بطايحي", "عائلة النجار"),
            ("عائلة طويل", "عائلة السالم"),
        ]
        changed += replace_in_directory(ROOT / template_id, replacements)
    for template_id, (baby, baby_en, short) in NEWBORN.items():
        replacements = [
            ("نور الدين مخملجي", baby), ("Nour Aldeen Mokhmalji", baby_en),
            ("محمد مخملجي", "سامي الرفاعي"), ("نجوى دبل", "ليلى ناصر"),
            ("مخملجي", "الرفاعي"), ("نور الدين", short),
        ]
        changed += replace_in_directory(ROOT / template_id, replacements)
    print(f"Updated {changed} text files")


if __name__ == "__main__":
    main()
