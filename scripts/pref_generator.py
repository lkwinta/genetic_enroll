import argparse
import re
import sys
from pathlib import Path

import pandas as pd
import numpy as np

sys.path.append(str(Path(__file__).resolve().parent.parent))

# Wagi atrybutów zajęć
# Im bliżej 1.0 tym bardziej preferowane zajęcia
WEIGHTS = {
    "day": {"Pn": 0.0, "Wt": 0.8, "Sr": 1.0, "Cz": 0.6, "Pt": 0.1},
    "hour": {
        "08:00": 0.1,
        "09:45": 0.5,
        "11:30": 0.6,
        "13:15": 1.0,
        "15:00": 0.8,
        "16:45": 0.4,
        "18:30": 0.1,
    },
    "teacher": {
        "Prowadzący-1": 1.0,
        "Prowadzący-9": 0.5,
    },
}


def preference_score(day_w, hour_w, teacher_w, noise):
    base = 0.2 * day_w + 0.5 * hour_w + 0.5 * teacher_w
    return np.clip((base + noise) * 10, 0, 10).round().astype(int)


def generate_preferences(plan, assign, noise_sigma=0.05, weights=WEIGHTS):
    plan = plan[plan["type"] != "W"].copy()
    records = []

    subject_groups = {s: grp_df for s, grp_df in plan.groupby("subject")}

    rng = np.random.default_rng()

    for _, stu_row in assign.iterrows():
        stu = stu_row["student_id"]
        personal_noise = rng.normal(0, noise_sigma)
        for subject, assigned in stu_row.items():
            if subject in subject_groups and assigned == 1:
                for _, g in subject_groups[subject].iterrows():
                    day_w = weights["day"].get(g.day, 0.6)
                    hour_w = weights["hour"].get(g.start_time, 0.6)
                    teacher_w = weights["teacher"].get(g.teacher, 0.6)

                    noise = rng.normal(0, noise_sigma)
                    pref = preference_score(
                        day_w, hour_w, teacher_w, personal_noise + noise
                    )

                    records.append(
                        {
                            "student_id": stu,
                            "subject": subject,
                            "group_id": g.group_id,
                            "preference": pref,
                        }
                    )
    return pd.DataFrame(records)


def get_number_from_path(path):
    pattern = r"(\d+)$"
    match = re.search(pattern, path)
    return match.group(1) if match else "X"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("plan_path")
    parser.add_argument("assignment_path")
    parser.add_argument("-o", "--out")
    # parser.add_argument('-n', '--n_students', type=int, default=200)

    # args = parser.parse_args('data/schedules/single_subject_x2.csv data/assignments/single_subject_x2.csv'.split())
    args = parser.parse_args()

    plan_path = Path(args.plan_path)
    plan_number = get_number_from_path(plan_path.stem)
    assignment_path = Path(args.assignment_path)
    out_path = (
        Path(args.out)
        if args.out
        else Path(f"data/preferences/preferences_{plan_number}.csv")
    )

    # Wczytanie planu
    plan = pd.read_csv(plan_path, sep=None, engine="python")
    assign = pd.read_csv(assignment_path, sep=None, engine="python")

    # Generowanie preferencji
    prefs = generate_preferences(plan, assign)

    # Zapis
    prefs.to_csv(out_path, index=False)
    print(f"Zapisano {len(prefs)} rekordów do {out_path}")


if __name__ == "__main__":
    main()
