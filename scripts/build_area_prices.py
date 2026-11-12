"""Build src/data/area_prices.json: sold-price facts for every postcode district.

Source: HM Land Registry Price Paid Data, Open Government Licence v3.0.
Only category A (standard open-market) sales are counted; repossessions,
buy-to-let portfolio and other bulk transfers (category B) are left out.

Land Registry registers sales weeks after completion, so the newest months are
always short. The window therefore ends two full months before the newest sale
in the file: "the 12 months to <end>" compared with the 12 months before that.

Each district also carries median_2020, the median for the 12 months to June
2020 (new builds left out), so the page can say how far prices have moved since
2020. It is rebuilt when pp-2019.csv and pp-2020.csv are both passed, and
otherwise carried over from the existing JSON.

Usage (yearly files from the Land Registry download page):
  python3 scripts/build_area_prices.py pp-2024.csv pp-2025.csv pp-2026.csv
  python3 scripts/build_area_prices.py --add-2020 pp-2019.csv pp-2020.csv   (patch the 2020 baseline only)
"""
import csv
import json
import statistics
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'area_prices.json'
MIN_SALES = 10        # below this a district gets no median at all
MIN_TYPE_SALES = 5    # below this a property type gets no median
TYPES = {'D': 'detached', 'S': 'semi', 'T': 'terraced', 'F': 'flat'}


def month_index(d: date) -> int:
    return d.year * 12 + d.month - 1


def label(mi: int) -> str:
    return date(mi // 12, mi % 12 + 1, 1).strftime('%B %Y')


def read_sales(path):
    """Yield (district, year, month, price, type, new_build, tenure) for standard sales."""
    with open(path, newline='', encoding='utf-8') as f:
        for r in csv.reader(f):
            if len(r) < 16 or r[14] != 'A':
                continue  # category A only
            if r[15] == 'D':
                continue  # record deleted by Land Registry
            pc = r[3].strip().upper()
            if ' ' not in pc:
                continue
            yield pc.split(' ')[0], int(r[2][:4]), int(r[2][5:7]), int(r[1]), r[4], r[5] == 'Y', r[6]


BASE_FILES = ('pp-2019.csv', 'pp-2020.csv')
BASE_FROM, BASE_TO = (2019, 7), (2020, 6)   # same July to June season as the current window
BASE_LABEL = 'June 2020'


def medians_2020(paths):
    """Median price per district, 12 months to June 2020, new builds left out.

    New builds are left out because the current window has almost none yet
    (they register late), and the full calendar year 2020 is skewed by the
    lockdown and the stamp duty holiday, so the comparison is July to June.
    """
    by = defaultdict(list)
    for path in paths:
        for district, y, m, price, _t, new, _ten in read_sales(path):
            if not new and BASE_FROM <= (y, m) <= BASE_TO:
                by[district].append(price)
    return {d: int(statistics.median(v)) for d, v in by.items() if len(v) >= MIN_SALES}


def add_2020(paths):
    """Patch median_2020 into the existing JSON without touching anything else."""
    out = json.loads(OUT.read_text())
    base = medians_2020(paths)
    n = 0
    for d, rec in out['districts'].items():
        rec.pop('median_2020', None)
        if d in base:
            rec['median_2020'] = base[d]
            n += 1
    out['baseline_2020'] = BASE_LABEL
    OUT.write_text(json.dumps(out, separators=(',', ':')))
    print(f'median_2020 set on {n} of {len(out["districts"])} districts, written to {OUT}')


def main(paths):
    # 2020 baseline: fresh if both baseline files are passed, else kept from the last build.
    base_paths = [p for p in paths if Path(p).name in BASE_FILES]
    paths = [p for p in paths if Path(p).name not in BASE_FILES]
    if len(base_paths) == len(BASE_FILES):
        base_2020 = medians_2020(base_paths)
    elif OUT.exists():
        old = json.loads(OUT.read_text())['districts']
        base_2020 = {d: r['median_2020'] for d, r in old.items() if r.get('median_2020')}
    else:
        base_2020 = {}
    rows = []
    newest = 0
    for p in paths:
        with open(p, newline='', encoding='utf-8') as f:
            for r in csv.reader(f):
                if len(r) < 16 or r[14] != 'A':
                    continue  # category A only
                if r[15] == 'D':
                    continue  # record deleted by Land Registry
                pc = r[3].strip().upper()
                if ' ' not in pc:
                    continue
                y, m = int(r[2][:4]), int(r[2][5:7])
                mi = y * 12 + m - 1
                newest = max(newest, mi)
                rows.append((pc.split(' ')[0], mi, int(r[1]), r[4], r[5] == 'Y', r[6]))

    end = newest - 2                    # last complete-enough month
    start = end - 11
    prev_start, prev_end = start - 12, start - 1

    cur = defaultdict(list)
    prev = defaultdict(list)
    for district, mi, price, ptype, new, tenure in rows:
        if start <= mi <= end:
            cur[district].append((price, ptype, new, tenure))
        elif prev_start <= mi <= prev_end:
            prev[district].append(price)

    districts = {}
    for d, sales in cur.items():
        n = len(sales)
        if n < MIN_SALES:
            continue
        prices = sorted(s[0] for s in sales)
        q = statistics.quantiles(prices, n=4)
        by_type = {}
        for code, name in TYPES.items():
            tp = [s[0] for s in sales if s[1] == code]
            if tp:
                by_type[name] = {
                    'sales': len(tp),
                    'share_pct': round(100 * len(tp) / n),
                    'median': int(statistics.median(tp)) if len(tp) >= MIN_TYPE_SALES else None,
                }
        p = prev.get(d, [])
        med = int(statistics.median(prices))
        change = None
        if len(p) >= MIN_SALES:
            pm = statistics.median(p)
            change = round(100 * (med - pm) / pm, 1)
        districts[d] = {
            'sales': n,
            'sales_prev': len(p),
            'median': med,
            'lower_quartile': int(q[0]),
            'upper_quartile': int(q[2]),
            'median_change_pct': change,
            'new_build_pct': round(100 * sum(1 for s in sales if s[2]) / n),
            'leasehold_pct': round(100 * sum(1 for s in sales if s[3] == 'L') / n),
            'types': by_type,
        }
        if d in base_2020:
            districts[d]['median_2020'] = base_2020[d]

    # Postcode-area figures (CV, B, SW...) so each district can be set against
    # its wider area: median of all sales, and the district's price rank.
    import re
    area_of = lambda d: re.match(r'[A-Z]+', d).group(0)
    area_prices = defaultdict(list)
    for d, sales in cur.items():
        area_prices[area_of(d)].extend(s[0] for s in sales)
    areas = {}
    for a, prices in area_prices.items():
        ranked = sorted((k for k in districts if area_of(k) == a), key=lambda k: -districts[k]['median'])
        for i, k in enumerate(ranked):
            districts[k]['rank_in_area'] = i + 1
            districts[k]['districts_in_area'] = len(ranked)
        if len(prices) >= MIN_SALES:
            areas[a] = {'sales': len(prices), 'median': int(statistics.median(prices))}

    out = {
        'period': f'{label(start)} to {label(end)}',
        'period_end': label(end),
        'previous_period': f'{label(prev_start)} to {label(prev_end)}',
        'baseline_2020': BASE_LABEL,
        'built': date.today().isoformat(),
        'source': 'HM Land Registry Price Paid Data (standard sales), Open Government Licence v3.0; Salet analysis',
        'areas': dict(sorted(areas.items())),
        'districts': dict(sorted(districts.items())),
    }
    OUT.write_text(json.dumps(out, separators=(',', ':')))
    print(f'{len(districts)} districts, {out["period"]}, written to {OUT}')


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == '--add-2020':
        add_2020(sys.argv[2:])
    else:
        main(sys.argv[1:])
