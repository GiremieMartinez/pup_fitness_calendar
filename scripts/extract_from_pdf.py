import fitz
import re
import sys

HEADER = {'PUP FITNESS CALENDAR', 'GIREMIE MARTINEZ', 'FLOPPY DISK', 'BSIT 1-2'}


def extract_items(pdf_path):
    doc = fitz.open(pdf_path)
    items = []
    for page in doc:
        for b in page.get_text('dict')['blocks']:
            if 'lines' not in b:
                continue
            for line in b['lines']:
                spans = line['spans']
                if not spans:
                    continue
                x0 = min(s['bbox'][0] for s in spans)
                text = ''.join(s['text'] for s in spans).rstrip()
                if text in HEADER:
                    continue
                items.append((x0, text))
    return items


def quotes_balanced(text):
    stripped = re.sub(r'"(?:\\.|[^"\\])*"', '""', text)
    stripped = re.sub(r"'(?:\\.|[^'\\])*'", "''", stripped)
    return stripped.count('"') % 2 == 0 and stripped.count("'") % 2 == 0


def needs_merge(text):
    t = text.rstrip()
    if not quotes_balanced(t):
        return True
    if t.count('(') > t.count(')'):
        return True
    if t.count('[') > t.count(']'):
        return True
    if t.count('{') > t.count('}'):
        # Dict entries are one line each in the PDF; do not merge them together.
        if re.search(r"':\s*'[^']*',?\s*$", t) or t.endswith('}') or t.endswith('},'):
            return False
        return True
    return False


def needs_merge_with_next(text, nxt, nxt_x, x):
    if needs_merge(text):
        return True
    t = text.rstrip()
    nxt_s = nxt.lstrip()
    if not nxt_s:
        return False
    # PDF wraps comments/phrases onto the next line at a lower x position.
    if re.search(r'\b(for|is)\s*$', t) or t.endswith(' this'):
        return True
    if nxt_x < x and nxt_s[0].islower() and not re.match(
        r'^(def |class |import |from |if |elif |else:|except|finally:|return |try:)',
        nxt_s,
    ):
        if t.count('(') > t.count(')') or t.endswith(','):
            return True
    return False


def merge_items(items):
    merged = []
    i = 0
    while i < len(items):
        x, text = items[i]
        while i + 1 < len(items):
            nxt_x, nxt = items[i + 1]
            if not needs_merge_with_next(text, nxt, nxt_x, x):
                break
            i += 1
            text = text.rstrip() + ' ' + nxt.lstrip()
            # Keep the opening line's indent, not continuation fragments at lower x.
        merged.append((x, text))
        i += 1
    return merged


def x_to_level(x, base=72.0, step=17.5):
    return max(0, round((x - base) / step))


def build_code(merged):
    indent = '    '
    return '\n'.join(indent * x_to_level(x) + t.strip() for x, t in merged if t.strip())


if __name__ == '__main__':
    pdf = sys.argv[1] if len(sys.argv) > 1 else 'SOURCE CODE.pdf'
    out = sys.argv[2] if len(sys.argv) > 2 else 'main.py'
    items = extract_items(pdf)
    merged = merge_items(items)
    code = build_code(merged)
    with open(out, 'w') as f:
        f.write(code)
    try:
        compile(code, out, 'exec')
        print(f'OK: wrote {out} ({len(merged)} lines)')
    except SyntaxError as e:
        print(f'SYNTAX ERROR in {out}: {e}')
        sys.exit(1)
