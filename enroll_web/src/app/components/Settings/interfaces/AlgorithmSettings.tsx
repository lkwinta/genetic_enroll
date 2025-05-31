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