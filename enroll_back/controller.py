import pandas as pd
import ray
from flask import request, jsonify, Flask
from flask_cors import CORS

from enroll_back.service import to_remote
from service import Service

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

algorithm_settings = {}
fitness_settings = {}
performance_settings = {}

if ray.is_initialized():
    ray.shutdown()
ray.init(num_cpus=8)
service = Service()

@app.route("/upload/settings", methods=["POST"])
def process_settings():
    data = request.json

    required_sections = ["algorithmSettings", "fitnessFunctionSettings", "performanceSettings"]
    if not all(section in data for section in required_sections):
        return jsonify({"error": "Missing configuration sections"}), 400

    set_settings(data)

    return jsonify({"message": "Settings processed successfully"}), 200

def set_settings(settings):
    rename_map = {
        'mutationType': 'mutation_type',
        'crossoverType': 'crossover_type',
        'selectionType': 'selection_type',
        'tournamentSize': 'tournament_size',
        'mutationRate': 'mutation_rate',
        'crossoverRate': 'crossover_rate',
        'elitismRate': 'elitism_rate',
        'generationsCount': 'max_generations',
        'populationSize': 'population_size',
        'earlyStoppingEnabled': 'enable_early_stopping',
        'earlyStoppingStagnationEpochs': 'early_stopping_stagnation_epochs',
        'preferenceWeight': 'preference_weight',
        'capacityWeight': 'capacity_weight',
        'diversityWeight': 'diversity_weight',
        'penaltyWeight': 'penalty_weight',
        'enableParallelProcessing': 'enable_parallel_processing',
        'threadCount': 'thread_count'
    }
    global algorithm_settings, fitness_settings, performance_settings
    algorithm_settings = {
        rename_map.get(k, k): v
        for k, v in settings.get("algorithmSettings").items()
    }
    fitness_settings = {
        rename_map.get(k, k): v
        for k, v in settings.get("fitnessFunctionSettings").items()
    }
    performance_settings = {
        rename_map.get(k, k): v
        for k, v in settings.get("performanceSettings").items()
    }

    thread_count = performance_settings.get("thread_count", 1)
    to_remote(thread_count)

@app.route('/upload/schedule', methods=['POST'])
def upload_schedule():
    schedule_json = request.get_json()
    if 'type' not in schedule_json or schedule_json['type'] != 'schedule':
        return jsonify({"error": "Invalid schedule type"}), 400

    df = pd.DataFrame(schedule_json['csvData'])

    try:
        service.load_schedule(df)
        return jsonify({"message": "Schedule loaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload/preferences', methods=['POST'])
def upload_preferences():
    preferences_json = request.get_json()
    if 'type' not in preferences_json or preferences_json['type'] != 'preferences':
        return jsonify({"error": "Invalid preferences type"}), 400

    df = pd.DataFrame(preferences_json['csvData'])

    try:
        service.load_preferences(df)
        return jsonify({"message": "Preferences loaded successfully"}), 200
    except Exception as e:
        print(f"Error loading preferences: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/start_evolution', methods=['POST'])
def start_evolution():
    try:
        service.start_evolution(algorithm_settings)

        return jsonify({"message": "Evolution started successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_best', methods=['GET'])
def get_best():
    try:
        best = service.get_best()
        if best['individual'] is None:
            return jsonify({"error": "No best individual found"}), 404

        return jsonify({
            "individual": {
                "type": "individual",
                "csvString": best['individual'].to_csv(),
            },
            "fitness": best['fitness'],
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_current_best', methods=['GET'])
def get_current_best():
    try:
        current_best = service.get_current_best()
        if current_best['individual'] is None:
            return jsonify({"error": "No current best individual found"}), 404

        return jsonify({
            "individual": {
                "type": "individual",
                "csvString": current_best['individual'].to_csv(),
            },
            "fitness": current_best['fitness'],
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_progress', methods=['GET'])
def get_progress():
    try:
        progress = service.get_progress()
        return jsonify({"progress": progress}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_history', methods=['GET'])
def get_history():
    try:
        history_data = service.get_history()
        return jsonify({"history": history_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_student_scores', methods=['GET'])
def get_student_scores():
    try:
        scores = service.score_per_student()
        return jsonify({"scores": scores}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
