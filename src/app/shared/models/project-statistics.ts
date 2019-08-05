export class ProjectStatistics {
  totalSamples: number;
  totalWords: number;
  annotatedSamples: number;
  totalAnnotations: number;

  constructor(data: Object) {
    Object.assign(this, data);
  }
}
