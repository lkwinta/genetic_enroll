from service import Service
import pandas as pd

import ray

if ray.is_initialized():
    ray.shutdown()
ray.init(num_cpus=12)
service = Service()

preferences = pd.read_csv("../data/preferences/prefs_1.csv", sep=',')
schedule = pd.read_csv("../data/schedules/schedule_1.csv", sep=";")

service.load_schedule(schedule)
service.load_preferences(preferences)

service.generate_population(1000)

service.evolve(
    max_generations=100,
    population_size=10,
    mutation_rate=0.1,
    crossover_rate=0.9,
    elitism_rate=0.2,
    selection_type="truncation",
    enable_early_stopping=True,
    early_stopping_stagnation_epochs=50,
    tournament_size=5,
    mutation_type="chain_swap",
    crossover_type="row_scx",
)

print(service.fitness_per_subject())