import random
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from threading import Thread

import pandas as pd
import ray

class Service:
    def __init__(self, thread_count=1):
        self.plan = None
        self.pref = None

        # Przydatne struktury
        self.students = None
        self.subjects = None

        # Liczba grup dla każdego przedmiotu:
        # subject -> number of groups
        self.num_groups = {}

        # Preferencje studentów dla danych grup:
        # (student_id, subject, group_id): preference
        self.pref_dict = {}

        # Pojemności grup:
        # (subject, group_id): capacity
        self.cap_dict = {}

        # Posortowane preferencje (malejąco po przyznanych punktach):
        # (student_id, subject): list of (group_id, preference)
        self.pref_sorted = None
        self.pref_dict_sorted = defaultdict(list)

        # Przedziały czasowe zajęć poszczególnych grup
        # (subject, group_id) -> (day, start_time, end_time)
        self.schedule_dict = {}

        self.groups_by_subject = {}

        self.plan_ref              = None
        self.pref_ref              = None
        self.students_ref          = None
        self.subjects_ref          = None
        self.num_groups_ref        = None
        self.pref_dict_ref         = None
        self.cap_dict_ref          = None
        self.pref_dict_sorted_ref  = None
        self.schedule_dict_ref     = None
        
        self.best_individual = None
        self.best_fitness = None
        self.history = None

        self.epochs_total = None
        self.epochs_current = None
        self.status = "not_started"



    def load_schedule(self, schedule_df):
        self.plan = schedule_df.copy()

        self.plan["start_time"] = pd.to_datetime(self.plan["start_time"], format="%H:%M").dt.time

        # Zmiana typu zajęć na ich pojemność
        capacities = {
            "L": 15,
            "P": 15,
            "C": 30,
        }

        self.plan = self.plan[self.plan["type"] != "W"]
        self.plan["type"] = self.plan["type"].map(capacities)
        self.plan.rename(columns={"type": "capacity"}, inplace=True)

        self.subjects = self.plan["subject"].unique()

        for subject in self.subjects:
            n = self.plan[self.plan["subject"] == subject]["group_id"].nunique()
            self.num_groups[subject] = n

        self.cap_dict = {(row.subject, row.group_id): row.capacity for row in self.plan.itertuples()}

        DUR = timedelta(minutes=90)
        for row in self.plan.itertuples():
            start = datetime.combine(datetime.today(), row.start_time)
            self.schedule_dict[(row.subject, row.group_id)] = (
                row.day,
                row.start_time,
                (start + DUR).time(),
            )

        self.groups_by_subject = {
            subject: self.plan[self.plan["subject"] == subject]["group_id"].unique().tolist()
            for subject in self.subjects
        }

        self.plan_ref              = ray.put(self.plan)
        self.subjects_ref          = ray.put(self.subjects)
        self.cap_dict_ref          = ray.put(self.cap_dict)
        self.schedule_dict_ref     = ray.put(self.schedule_dict)
        self.num_groups_ref        = ray.put(self.num_groups)
        self.groups_by_subject_ref = ray.put(self.groups_by_subject)

    def load_preferences(self, preferences_df):
        self.pref = preferences_df.copy()

        self.students = self.pref["student_id"].unique()
        self.pref_dict = {
            (row.student_id, row.subject, row.group_id): row.preference
            for row in self.pref.itertuples()
        }

        self.pref_sorted = self.pref.sort_values(
            by=["student_id", "subject", "preference"], ascending=[True, True, False]
        )
        for row in self.pref_sorted.itertuples():
            self.pref_dict_sorted[(row.student_id, row.subject)].append(
                (row.group_id, row.preference)
            )

        self.pref_ref             = ray.put(self.pref)
        self.students_ref         = ray.put(self.students)
        self.pref_dict_ref        = ray.put(self.pref_dict)
        self.pref_dict_sorted_ref = ray.put(self.pref_dict_sorted)
    
    def generate_population(self, size):
        population = []
        shuffled = self.students.copy()

        for _ in range(size):
            random.shuffle(shuffled)
            population.append(
                generate_individual.remote(
                    self.plan_ref,
                    self.schedule_dict_ref,
                    self.num_groups_ref,
                    shuffled,
                    self.subjects_ref,
                    self.cap_dict_ref,
                )
            )

        return ray.get(population)

    def selection_tournament(self, population, scores, tournament_size, elitism_rate):
        """
        Wybiera osobników do krzyżowania na podstawie turniejowej selekcji.
        """
        selected = []
        population_scores = list(zip(population, scores))

        for _ in range(int(len(population) * elitism_rate)):
            enumerated = list(enumerate(population_scores))
            tournament = random.sample(enumerated, tournament_size)
            tournament.sort(key=lambda x: x[1][1], reverse=True)
            index, winner = tournament[0]
            selected.append(winner[0])

            population_scores.pop(index)

        return selected

    def selection_truncation(self, population, scores, elitism_rate):
        """
        Wybiera osobników do krzyżowania na podstawie selekcji trunkacyjnej.
        """
        sorted_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
        elite_size = int(len(sorted_indices) * elitism_rate)
        selected_indices = sorted_indices[:elite_size]
        return [population[i] for i in selected_indices]
    

    def start_evolution(self, kwargs):
        self.evolution_thread = Thread(target=self.evolve, kwargs=kwargs)
        self.evolution_thread.start()

    def evolve(
            self,
            *,
            mutation_type,
            crossover_type,
            selection_type,
            tournament_size,
            mutation_rate,
            crossover_rate,
            elitism_rate,
            max_generations,
            population_size,
            enable_early_stopping,
            early_stopping_stagnation_epochs,
            # preference_weight,
            # capacity_weight,
            # diversity_weight,
            # penalty_weight,
    ):
        population = self.generate_population(population_size)
        stagnation_count = 0
        
        self.history = []
        self.current_best_individual = None
        self.current_best_fitness = 1e-9
        self.status = "running"
        self.epochs_current = 0
        self.epochs_total = max_generations

        print("Starting evolution...")
        for gen in range(max_generations):

            if crossover_type == 'row_scx':
                population = [reorder_by_row_fitness.remote(individual, self.pref_dict_ref, self.pref_ref) for individual in population]
                population = ray.get(population)

            scores = [
                fitness.remote(self.pref_ref, individual, self.pref_dict_ref)
                for individual in population
            ]
            scores = ray.get(scores)

            max_f = max(scores)
            avg_f = sum(scores) / len(scores)
            min_f = min(scores)
            self.history.append({
                "generation": gen,
                "max_fitness": max_f,
                "avg_fitness": round(avg_f, 3),
                "min_fitness": min_f
            })
            if max_f > self.current_best_fitness:
                self.current_best_fitness = max_f
                self.current_best_individual = population[scores.index(max_f)]
                stagnation_count = 0
            else:
                stagnation_count += 1
                if enable_early_stopping and stagnation_count >= early_stopping_stagnation_epochs:
                    print("Early stopping triggered due to stagnation.")
                    break

            if selection_type == "truncation":
                elite_population = self.selection_truncation(population, scores, elitism_rate)
            elif selection_type == "tournament":
                elite_population = self.selection_tournament(population, scores, tournament_size, elitism_rate)

            new_population = []

            while len(new_population) + len(elite_population) < population_size:
                p1 = random.choice(elite_population)
                p2 = random.choice(elite_population)

                if random.random() < crossover_rate:
                    if crossover_type == "row_scx":
                        child = row_scx.remote(p1, p2, self.cap_dict_ref, self.students_ref, self.schedule_dict_ref)
                    elif crossover_type == "column_pmx":
                        child = column_pmx.remote(p1, p2, self.cap_dict_ref, self.subjects_ref)
                        child = repair_collisions.remote(child, self.cap_dict_ref, self.students_ref, self.schedule_dict_ref, self.groups_by_subject_ref, self.num_groups_ref)
                else:
                    child = p1.copy()

                if mutation_type == "swap":
                    child = mutate_swap.remote(self.students_ref, self.schedule_dict_ref, child, mutation_rate)
                # elif mutation_type == "chain_swap":
                #     child = mutate_chain_swap.remote(self.students_ref, self.schedule_dict_ref, child, mutation_rate)

                new_population.append(child)

            population = ray.get(new_population)
            population.extend(elite_population)

            if gen % 10 == 0 or gen == max_generations - 1:
                print(f"Pokolenie {gen}: najlepszy fitness = {max_f}")

            self.epochs_current = gen + 1

        self.best_individual = self.current_best_individual
        self.best_fitness = self.current_best_fitness
        self.status = "finished"

    def get_progress(self):
        """
        Zwraca postęp ewolucji.

        Zwraca status, aktualną liczbę epok i całkowitą liczbę epok.
        """
        return {
            "status": self.status,
            "current_epochs": self.epochs_current, 
            "total_epochs": self.epochs_total
        }

    def get_current_best(self):
        """
        Zwraca aktualnego najlepszego osobnika (plan zajęć) i jego fitness.
        """
        return {
            "fitness": self.current_best_fitness, 
            "individual": self.current_best_individual
        }

    def get_best(self):
        """
        Zwraca najlepszego osobnika (plan zajęć) po ewolucji.
        """
        return {
            "fitness": self.best_fitness, 
            "individual": self.best_individual
        }
    
    def get_status(self):
        """
        Zwraca status ewolucji.
        """
        return self.status

    def get_history(self):
        """
        Zwraca historię ewolucji (najlepszy fitness w każdym pokoleniu).
        """
        return self.history

    def score_per_student(self):
        scores: list[dict] = []
        max_points = self.pref.groupby(["student_id", "subject"])["preference"].max()

        for student in self.best_individual.index:
            student_max = max_points[student].sum()
            student_score = 0
            for subject in self.best_individual.columns:
                group = self.best_individual.loc[student, subject]
                key = (student, subject, group)
                points = self.pref_dict.get(key, 0)

                student_score += points

            scores.append({
                "student": student,
                "score": int(student_score),
                "max_score": int(student_max),
            })
        return scores
    
    def fitness_per_subject(self):
        subject_scores = defaultdict(float)
        subject_max = defaultdict(float)

        max_points = self.pref.groupby(["student_id", "subject"])["preference"].max().reset_index()

        for _, row in max_points.iterrows():
            subject = row['subject']
            subject_max[subject] += row['preference']

        for student in self.best_individual.index:
            for subject in self.best_individual.columns:
                group = self.best_individual.loc[student, subject]
                key = (student, subject, group)
                points = self.pref_dict.get(key, 0)

                subject_scores[subject] += points

        fitness_per_subject = [
            {"subject": subject, "fitness": round(subject_scores[subject] / subject_max[subject], 2)}
            if subject_max[subject] > 0 else 1.0
            for subject in subject_scores
        ]

        return fitness_per_subject


@ray.remote
def generate_individual(
    plan, schedule_dict, num_groups, students, subjects, cap_dict
):
    """
    Generuje jednego osobnika (kompletne przypisanie studentów do grup)

    Dla każdego studenta, przypisuje go do najbardziej preferowanej grupy, w której
    jest jeszcze miejsce, i która nie koliduje z jego obecnym planem.
    Jeśli nigdzie nie ma miejsca, przypisuje go do grupy z najmniejszym przepełnieniem.
    """

    occupancy = {key: 0 for key in cap_dict}
    reserved = {stu: Counter() for stu in students}

    groups_by_subject = {
        subject: plan[plan["subject"] == subject]["group_id"].unique().tolist()
        for subject in subjects
    }

    df = pd.DataFrame(index=students, columns=subjects)
    for student in students:
        generate_student(df, student, occupancy, reserved, subjects, groups_by_subject, cap_dict, schedule_dict, num_groups)
    return df

def fitness_per_student(pref, individual, pref_dict):

        student_scores = defaultdict(float)
        student_max = defaultdict(float)

        max_points = pref.groupby(["student_id", "subject"])["preference"].max().reset_index()
        for _, row in max_points.iterrows():
            student = row['student_id']
            student_max[student] += row['preference']

        for student in individual.index:
            for subject in individual.columns:
                group = individual.loc[student, subject]
                key = (student, subject, group)
                points = pref_dict.get(key, 0)

                student_scores[student] += points

        fitness_dict = {
            student: round(student_scores[student] / student_max[student], 2)
            if student_max[student] > 0 else 1.0
            for student in student_scores
        }
        
        return fitness_dict

@ray.remote
def reorder_by_row_fitness(individual: pd.DataFrame,
                           pref_dict,
                           pref) -> pd.DataFrame:
    
    row_scores = list(fitness_per_student(pref, individual, pref_dict).items())
    row_scores.sort(key=lambda x: x[1], reverse=True)
    ordered_index = [stu for stu, _ in row_scores]

    return individual.loc[ordered_index]

@ray.remote
def mutate_swap(
    students, schedule_dict, individual, mutation_rate, max_attempts=50
):
    mutated = individual.copy()
    reserved = {stu: Counter() for stu in students}
    students_list = students.tolist()

    for stu in mutated.index:
        for subj in mutated.columns:
            group_id = mutated.loc[stu, subj]
            reserved[stu][schedule_dict[(subj, group_id)]] += 1

    for stu_a in mutated.index:
        for subj in mutated.columns:
            if random.random() < mutation_rate:
                for _ in range(max_attempts):
                    stu_b = random.choice(students_list)

                    if stu_a == stu_b:
                        continue

                    if pd.isna(grp_a := mutated.loc[stu_a, subj]):
                        continue
                    if pd.isna(grp_b := mutated.loc[stu_b, subj]):
                        continue
                    if grp_a == grp_b:
                        continue

                    day_a, s_a, e_a = schedule_dict[(subj, grp_a)]
                    day_b, s_b, e_b = schedule_dict[(subj, grp_b)]

                    if reserved[stu_b][(day_a, s_a, e_a)] != 0:
                        continue
                    if reserved[stu_a][(day_b, s_b, e_b)] != 0:
                        continue

                    mutated.loc[stu_a, subj] = grp_b
                    mutated.loc[stu_b, subj] = grp_a

                    reserved[stu_a][(day_a, s_a, e_a)] -= 1
                    reserved[stu_a][(day_b, s_b, e_b)] += 1
                    reserved[stu_b][(day_b, s_b, e_b)] -= 1
                    reserved[stu_b][(day_a, s_a, e_a)] += 1

                    break
    return mutated

def generate_student(individual, student, occupancy, reserved, subjects, groups_by_subject, cap_dict, schedule_dict, num_groups):
    for subject in subjects:
        groups_ok = []
        overflowed_but_ok = []
        conflicts_but_ok = []

        for group_id in groups_by_subject[subject]:
            occupancy_flag = False
            conflict_flag = False

            if occupancy[(subject, group_id)] >= cap_dict.get(
                (subject, group_id), 0
            ):
                occupancy_flag = True

            day, s, e = schedule_dict[(subject, group_id)]
            if reserved[student][(day, s, e)] != 0:
                conflict_flag = True

            if not occupancy_flag and not conflict_flag:
                groups_ok.append(group_id)
            elif occupancy_flag and not conflict_flag:
                overflowed_but_ok.append(group_id)
            elif not occupancy_flag and conflict_flag:
                conflicts_but_ok.append(group_id)
                
        if groups_ok:
            group_id = random.choice(groups_ok)
        
        elif conflicts_but_ok:
            group_id = random.choice(conflicts_but_ok)
            for stu_b in individual.index:
                if student != stu_b:
                    if pd.isna(grp_b := individual.loc[stu_b, subject]):
                        continue
                    if group_id == grp_b:
                        continue

                    day_a, s_a, e_a = schedule_dict[(subject, group_id)]
                    day_b, s_b, e_b = schedule_dict[(subject, grp_b)]

                    if reserved[stu_b][(day_a, s_a, e_a)] != 0:
                        continue
                    if reserved[student][(day_b, s_b, e_b)] != 0:
                        continue

                    individual.loc[stu_b, subject] = group_id
                    reserved[stu_b][(day_b, s_b, e_b)] -= 1
                    reserved[stu_b][(day_a, s_a, e_a)] += 1
                    occupancy[(subject, group_id)] += 1

                    group_id = grp_b
                    occupancy[(subject, group_id)] -= 1
                    break
            else: 
                print(
                f"Konflikt: Brak grup dla studenta {student} i przedmiotu {subject}"
                )
                group_id = random.randint(1, num_groups[subject])

        else:
            print(
                f"Konflikt: Brak grup dla studenta {student} i przedmiotu {subject}"
            )
            group_id = random.randint(1, num_groups[subject])
            break

        individual.loc[student, subject] = group_id
        occupancy[(subject, group_id)] += 1
        reserved[student][schedule_dict[(subject, group_id)]] += 1

@ray.remote
def row_scx(parent_1, parent_2, cap_dict, students, schedule_dict, subjects, groups_by_subject, num_groups):
    child = pd.DataFrame(index=parent_1.index, columns=parent_1.columns)

    occupancy = {key: 0 for key in cap_dict}
    reserved = {stu: Counter() for stu in students}

    parents = [parent_1, parent_2]

    for i, stu in enumerate(parent_1.index):
        row = parents[i % 2].loc[stu]
        
        for i in range(2):
            for subj, group_id in row.items():
                if occupancy[(subj, group_id)] >= cap_dict[(subj, group_id)]:
                    row = parents[(i + 1) % 2].loc[stu]
                    break
            else:
                break
        else:
            generate_student(child, stu, occupancy, reserved, subjects, groups_by_subject, cap_dict, schedule_dict, num_groups)
            continue
        
        for subj, group_id in row.items():
            occupancy[(subj, group_id)] += 1
            key = schedule_dict[(subj, group_id)]
            reserved[stu][key] += 1

        child.loc[stu] = row
    
    return child

def pmx(p1: list, p2: list) -> list: 
    n = len(p1)
    a, b = sorted(random.sample(range(n), 2))

    child = [None] * n
    child[a:b] = p1[a:b]
    for i in range(a, b):
        if p2[i] not in child:
            pos = i
            while a <= pos < b:
                pos = p2.index(p1[pos])
            child[pos] = p2[i]

    for i in range(n):
        if child[i] is None:
            child[i] = p2[i]

    return child

def df_to_perm(df, subj, slots) -> list:
    bucket = defaultdict(list)
    for stu, group_id in df[subj].items():
        bucket[group_id].append(stu)

    empty_count = 0
    perm = []
    for g in slots:
        if bucket[g]:
            perm.append(bucket[g].pop())
        else:
            empty_count += 1
            perm.append(f"empty_{empty_count}")
    return perm

def perm_to_df(perm, slots):
    series = pd.Series(index=perm, dtype="Int64")
    for stu, grp in zip(perm, slots):
        if stu.startswith("empty"):
            continue
        series[stu] = int(grp)
    return series

@ray.remote
def column_pmx(parent1, parent2, cap_dict, subjects):
    child = pd.DataFrame(index=parent1.index, columns=parent1.columns)

    slots_by_subj = defaultdict(list)
    for (subj, group_id), cap in cap_dict.items():
        slots_by_subj[subj] += [group_id] * cap

    for subj in subjects:
        slots = slots_by_subj[subj]

        perm1 = df_to_perm(parent1, subj, slots)
        perm2 = df_to_perm(parent2, subj, slots)

        child_perm = pmx(perm1, perm2)
       
        child[subj] = perm_to_df(child_perm, slots)

    return child    

@ray.remote
def repair_collisions(df: pd.DataFrame, cap_dict, students, schedule_dict, groups_by_subject, num_groups):
    occupancy = {key: 0 for key in cap_dict}
    reserved = {stu: Counter() for stu in students}

    for student in df.index:
        for subject in df.columns:
            group_id = df.loc[student, subject]
            reserved[student][schedule_dict[(subject, group_id)]] += 1
            occupancy[(subject, group_id)] += 1

    count = 0
    for student in df.index:
        for subject in df.columns:
            group_id = df.loc[student, subject]
            slot = schedule_dict[(subject, group_id)]

            if reserved[student][slot] == 1:
                continue
            
            count += 1
            groups_ok = []

            for gid in groups_by_subject[subject]:
                occupancy_flag = False
                conflict_flag = False

                if occupancy[(subject, gid)] >= cap_dict.get(
                    (subject, gid), 0
                ):
                    occupancy_flag = True

                day, s, e = schedule_dict[(subject, gid)]
                if reserved[student][(day, s, e)] != 0:
                    conflict_flag = True

                if not occupancy_flag and not conflict_flag:
                    groups_ok.append(gid)
                    
            if groups_ok:
                group_id = random.choice(groups_ok)
                df.loc[student, subject] = group_id
                occupancy[(subject, group_id)] += 1
                reserved[student][schedule_dict[(subject, group_id)]] += 1
                continue

            else:
                for stu_b in df.index:
                    if student != stu_b:
                        if pd.isna(grp_b := df.loc[stu_b, subject]):
                            continue
                        if group_id == grp_b:
                            continue

                        day_a, s_a, e_a = schedule_dict[(subject, group_id)]
                        day_b, s_b, e_b = schedule_dict[(subject, grp_b)]

                        if reserved[stu_b][(day_a, s_a, e_a)] != 0:
                            continue
                        if reserved[student][(day_b, s_b, e_b)] != 0:
                            continue

                        df.loc[stu_b, subject] = group_id
                        df.loc[student, subject] = grp_b

                        reserved[stu_b][(day_b, s_b, e_b)] -= 1
                        reserved[stu_b][(day_a, s_a, e_a)] += 1
                        reserved[student][(day_b, s_b, e_b)] += 1
                        reserved[student][(day_a, s_a, e_a)] -= 1
                        break
                else: 
                    print(
                    f"Konflikt: Brak grup dla studenta {student} i przedmiotu {subject}"
                    )
                    group_id = random.randint(1, num_groups[subject])
                continue

    return df

@ray.remote
def crossover_split(parent1, parent2, cut):
    """
    Krzyżuje dwóch osobników i zwraca nowego.

    Obecnie, bierze pół planu od jednego rodzica i pół do drugiego
    nie patrząc na żadne warunki Xd.
    """

    students = parent1.index.tolist()
    subjects = parent1.columns.tolist()

    child = pd.DataFrame(index=students, columns=subjects)

    for i, student in enumerate(students):
        source = parent1 if i < cut else parent2
        for subject in subjects:
            child.loc[student, subject] = source.loc[student, subject]

    return child

@ray.remote
def crossover_fill(schedule_dict, parent1, parent2):
    """
    Krzyżuje dwóch osobników i zwraca nowego.

    Birze z parenta2 wszystko co moze w wolne miejsca w parent1
    """

    child = parent1.copy()
    reserved = {stu: Counter() for stu in parent1.index}

    for student in child.index:
        for subject in child.columns:
            group_id = child.loc[student, subject]
            reserved[student][schedule_dict[(subject, group_id)]] += 1

    students = child.index.tolist()
    subjects = child.columns.tolist()

    for student in students:
        for subject in subjects:
            group_id = child.loc[student, subject]
            day, s, e = schedule_dict[(subject, group_id)]

            if reserved[student][(day, s, e)] == 0:
                # Szukamy grupy w parent2
                for group_id2 in parent2[subject].unique():
                    if group_id2 == group_id:
                        continue

                    day2, s2, e2 = schedule_dict[(subject, group_id2)]
                    if reserved[student][(day2, s2, e2)] == 0:
                        child.loc[student, subject] = group_id2
                        reserved[student][(day, s, e)] -= 1
                        reserved[student][(day2, s2, e2)] += 1
                        break

    return child

@ray.remote
def fitness(pref, individual, pref_dict):
    total_points = 0
    max_points = pref.groupby(["student_id", "subject"])["preference"].max().sum()

    for student in individual.index:
        for subject in individual.columns:
            group = individual.loc[student, subject]
            key = (student, subject, group)
            points = pref_dict.get(key, 0)

            total_points += points

    return float(round(total_points / max_points, 2))
