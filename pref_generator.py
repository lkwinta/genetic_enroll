import argparse
import re
from pathlib import Path

import pandas as pd
import numpy as np


# Wagi atrybutów zajęć
# Im bliżej 1.0 tym bardziej preferowane zajęcia 
DAY_WEIGHTS = { 
    'Pn': 0.2, 'Wt': 1.0, 'Śr': 0.9, 'Cz': 0.7, 'Pt': 0.1
}

HOUR_WEIGHTS = {
    '08:00': 0.1, '09:45': 0.6, '11:30': 1.0, '13:15': 1.0, '15:00': 0.8, '16:45': 0.4, '18:30': 0.1
}

TEACHER_WEIGHTS = {
    'Prowadzący‑1': 0.6,
    'Prowadzący‑2': 0.6,
}

def preference_score(day_w, hour_w, teacher_w, noise):
    base = 0.2*day_w + 0.9*hour_w + 0.0*teacher_w
    return np.clip((base + noise) * 10, 0, 10).round().astype(int)

def generate_preferences(plan, assign: pd.DataFrame, noise_sigma=0.05):
    records = []
    
    subject_groups = {s: grp_df for s, grp_df in plan.groupby('subject')}

    rng = np.random.default_rng()

    for _, stu_row in assign.iterrows():
        stu = stu_row['student_id']
        personal_noise = rng.normal(0, noise_sigma)
        for subject, assigned in stu_row.items():
            if subject in subject_groups and assigned == 1:
                for _, g in subject_groups[subject].iterrows():
                    day_w = DAY_WEIGHTS.get(g.day, 0.6)
                    hour_w = HOUR_WEIGHTS.get(g.start_time, 0.6)
                    teacher_w = TEACHER_WEIGHTS.get(g.teacher, 0.6)

                    noise = rng.normal(0, noise_sigma)
                    pref = preference_score(day_w, hour_w, teacher_w, personal_noise+noise)

                    records.append({
                        'student_id': stu,
                        'subject': subject,
                        'group_id': g.group_id,
                        'preference': pref
                    })
    return pd.DataFrame(records)

# Może się przydać do porównania
def generate_preferences1(plan, n_students):
    students =  [f"student_{i+1}" for i in range(n_students)]

    # Filtrowanie planu (pomijamy wykłady)
   

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
    parser.add_argument('assignment_path')
    parser.add_argument('-o', '--out')
    # parser.add_argument('-n', '--n_students', type=int, default=200)

    # args = parser.parse_args('data/schedules/schedule_1.csv data/assignments/subject_assignment_1.csv'.split())
    args = parser.parse_args()

    plan_path = Path(args.plan_path)
    plan_number = get_number_from_path(plan_path.stem)
    assignment_path = Path(args.assignment_path)
    out_path = Path(args.out) if args.out else Path(f'data/preferences/preferences_{plan_number}.csv')

    # Wczytanie planu
    plan = pd.read_csv(plan_path, sep=None, engine='python')
    plan = plan[plan['type'] != 'W'].copy()
    assign = pd.read_csv(assignment_path, sep=None, engine='python')

    # Generowanie preferencji
    prefs = generate_preferences(plan, assign)

    # Zapis
    prefs.to_csv(out_path, index=False)
    print(f"Zapisano {len(prefs)} rekordów do {out_path}")


if __name__ == "__main__":
    main()

