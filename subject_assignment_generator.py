import argparse
from pathlib import Path
import pandas as pd
import numpy as np
import re

def parse_distribution(dis):
    return np.array(dis) / sum(dis)

def generate_assignmnet(plan, n_students, distribution):
    students =  [f"student_{i+1}" for i in range(n_students)]

    dis = parse_distribution(distribution)
    paths = [chr(ord('A') + i) for i in range(len(dis))]
    chosen_paths = np.random.choice(paths, size=n_students, p=dis)

    subjects = sorted(plan['subject'].unique())

    general_subjects = set(plan[plan['specialization'] == 'G']['subject'])
    elective_subjects = sorted(plan[plan['specialization'] == 'O']['subject'].unique())
    path_subjects = {
        p: set(plan[plan['specialization'] == p]['subject'])
        for p in paths
    }

    df = pd.DataFrame('', index=range(n_students), columns=['student_id', 'path'] + subjects)
    df['student_id'] = students
    df['path'] = chosen_paths

    for i, row in df.iterrows():
        path = row['path']
        subjects_to_fill = general_subjects | path_subjects.get(path, set())
        df.loc[i, list(subjects_to_fill)] = 1

        if len(elective_subjects) >= 2:
            electives = np.random.choice(elective_subjects, size=2, replace=False)
            df.loc[i, electives] = 1

    return df

def get_number_from_path(path):
    pattern = r'(\d+)$'
    match = re.search(pattern, path)
    return match.group(1) if match else 'X'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('plan_path')
    parser.add_argument('-n', '--n_students', type=int, default=220)
    parser.add_argument('-p', '--path_distribution', nargs='+', type=float, default=[0.45, 0.45, 0.1])
    parser.add_argument('-o', '--out')

    # args = parser.parse_args(f'data/schedules/schedule_1.csv -n 220 -p 90 90 30'.split())
    args = parser.parse_args()

    plan_path = Path(args.plan_path)
    plan_number = get_number_from_path(plan_path.stem)
    out_path = Path(args.out) if args.out else Path(f'data/assignments/subject_assignment_{plan_number}.csv')

    # Wczytanie planu
    plan = pd.read_csv(plan_path, sep=None, engine='python')
    plan = plan[plan['type'] != 'W'].copy()

    df = generate_assignmnet(plan, args.n_students, args.path_distribution)

    df.to_csv(out_path, sep=';', index=False)
    print(f"Zapisano {len(df)} rekordów do {out_path}")

if __name__ == '__main__':
    main()