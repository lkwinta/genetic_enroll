import pandas as pd
import numpy as np
import argparse
from pathlib import Path
import re

def generate_preferences(plan, n_students):
    students =  [f"student_{i+1}" for i in range(n_students)]

    # Filtrowanie planu (pomijamy wykłady)
    plan = plan[plan['type'] != 'W'].copy()

    # Przygotowanie tabeli grup
    groups = plan[['subject', 'group_id']].copy()
    groups['key'] = 1

    # Przygotowanie tebeli studentów
    df_students = pd.DataFrame({'student_id': students})
    df_students['key'] = 1

    # Studzenci x grupy
    cart = df_students.merge(groups, on='key').drop(columns='key')

    # Losowanie preferencji (0-10)
    cart['preference'] = np.random.randint(0, 11, size=len(cart))
    return cart

def get_number_from_path(path):
    pattern = r'(\d+)$'
    match = re.search(pattern, path)
    return match.group(1) if match else 'X'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('plan_path')
    parser.add_argument('-o', '--out')
    parser.add_argument('-n', '--n_students', type=int, default=200)

    args = parser.parse_args()

    plan_path = Path(args.plan_path)
    plan_number = get_number_from_path(plan_path.stem)
    out_path = Path(args.out) if args.out else Path(f'data/preferences/preferences_{plan_number}.csv')

    # Wczytanie planu
    plan = pd.read_csv(plan_path, sep=None, engine='python')
    plan.head(5)

    # Generowanie preferencji
    prefs = generate_preferences(plan, args.n_students)

    # Zapis
    prefs.to_csv(out_path, index=False)
    print(f"Zapisano {len(prefs)} rekordów do {out_path}")


if __name__ == "__main__":
    main()

