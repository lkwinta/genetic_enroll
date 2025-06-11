from service import Service, to_remote
import pandas as pd

import ray

if ray.is_initialized():
    ray.shutdown()
ray.init()
service = Service()
to_remote(12)

preferences = pd.read_csv("../data/preferences/prefs_1.csv", sep=',')
schedule = pd.read_csv("../data/schedules/schedule_1.csv", sep=";")

service.load_schedule(schedule)
service.load_preferences(preferences)

service.generate_population(1000)

print(service.evolve(
    max_generations=100,
    population_size=10,
    mutation_rate=0.1,
    crossover_rate=0.9,
    elitism_rate=0.2,
    selection_type="truncation",
    enable_early_stopping=True,
    early_stopping_stagnation_epochs=50,
    tournament_size=5,
    mutation_type="swap",
    crossover_type="split",
))

print(service.fitness_per_subject())