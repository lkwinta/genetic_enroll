import io

import ray
from flask import request, jsonify, Flask, send_file
from flask_cors import CORS
from service import Service

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

algorithm_settings = {}
fitness_settings = {}
performance_settings = {}

if ray.is_initialized():
    ray.shutdown()
ray.init()
service = Service.remote()

@app.route("/settings", methods=["POST"])
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

@app.route('/upload/schedule', methods=['POST'])
def upload_schedule():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        ray.get(service.load_schedule.remote(file.filename))
        return jsonify({"message": "Schedule loaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload/preferences', methods=['POST'])
def upload_preferences():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        ray.get(service.load_preferences.remote(file.filename))
        return jsonify({"message": "Preferences loaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/elapse', methods=['GET'])
def elapse():
    #mock
    ray.get(service.load_schedule.remote("../data/schedules/schedule_1.csv"))
    ray.get(service.load_preferences.remote("../data/preferences/preferences_1.csv"))

    try:
        best_individual, best_fitness, history = ray.get(service.evolve.remote(**algorithm_settings,))

        csv_buffer = io.StringIO()
        best_individual.to_csv(csv_buffer, sep=";")
        csv_buffer.seek(0)

        return send_file(
            io.BytesIO(csv_buffer.getvalue().encode()),
            mimetype='text/csv',
            as_attachment=True,
            download_name='schedule.csv'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/score', methods=['GET'])
def score_per_student():
    try:
        scores = ray.get(service.score_per_student.remote())
        return jsonify(scores), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
