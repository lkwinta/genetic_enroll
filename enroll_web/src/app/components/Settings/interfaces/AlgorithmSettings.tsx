type MutationType = 'A' | 'B';
type CrossoverType = 'A' | 'B'; 

interface AlgorithmSettings {
    mutationType: MutationType;
    crossoverType: CrossoverType;

    generationsCount: number;
    populationSize: number;

    earlyStopping: boolean;

    elitismRate: number;
    crossoverRate: number;
    mutationRate: number;
}

interface FitnessFunctionSettings {
    preferenceWeight: number;
    capacityWeight: number;
    diversityWeight: number;
    penaltyWeight: number;
}

interface PerformanceSettings {
    enableParallelProcessing: boolean;
    threadCount: number;
}

interface CombinedSettings {
    algorithm: AlgorithmSettings;
    fitnessFunction: FitnessFunctionSettings;
    performance: PerformanceSettings;
};

export default interface GASettings {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  elitismRate: number;
  tournamentSize: number;
  convergenceThreshold: number;
  maxStagnation: number;
  preferenceWeight: number;
  capacityWeight: number;
  diversityWeight: number;
  penaltyWeight: number;
  enableParallelProcessing: boolean;
  enableAdaptiveMutation: boolean;
  enableIslandModel: boolean;
  islandCount: number;
  migrationRate: number;
  migrationInterval: number;
}