from service import Service
import pandas as pd

import ray

if ray.is_initialized():
    ray.shutdown()
ray.init()
service = Service.remote()

preferences = pd.read_csv("../data/preferences/preferences_1.csv", sep=',')
schedule = pd.read_csv("../data/schedules/schedule_1.csv", sep=";")

ray.get(service.load_schedule.remote(schedule))
ray.get(service.load_preferences.remote(preferences))

ray.get(service.generate_population.remote(1000))

