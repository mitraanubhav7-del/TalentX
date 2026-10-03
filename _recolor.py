from pathlib import Path

root = Path(__file__).parent / "src"
subs = [
    ("color: '#fff'", "color: 'var(--text-primary)'"),
    ('color: "#fff"', "color: 'var(--text-primary)'"),
    ("color: '#FFFFFF'", "color: 'var(--text-primary)'"),
    ("background: 'rgba(255, 255, 255, 0.02)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(255, 255, 255, 0.03)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(255, 255, 255, 0.04)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(255, 255, 255, 0.05)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(255, 255, 255, 0.06)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(255, 255, 255, 0.08)'", "background: 'var(--track)'"),
    ("background: 'rgba(255, 255, 255, 0.015)'", "background: 'var(--surface-tint)'"),
    ("background: 'rgba(15, 23, 42, 0.7)'", "background: 'var(--surface-tint)'"),
    ("background: '#0F172A'", "background: '#FFFFFF'"),
    ("color: '#818CF8'", "color: 'var(--primary)'"),
    ("color: '#38BDF8'", "color: 'var(--primary)'"),
    ("color: '#06B6D4'", "color: 'var(--primary)'"),
    ("color: '#34D399'", "color: 'var(--accent-emerald)'"),
    ("color: '#C7D2FE'", "color: 'var(--primary)'"),
    ("color: '#A5B4FC'", "color: 'var(--primary)'"),
]
skip = {"Navbar.jsx", "ProfileView.jsx"}
for p in root.rglob("*.jsx"):
    if p.name in skip:
        continue
    t = p.read_text(encoding="utf-8")
    orig = t
    for a, b in subs:
        t = t.replace(a, b)
    if t != orig:
        p.write_text(t, encoding="utf-8")
        print("updated", p.name)
