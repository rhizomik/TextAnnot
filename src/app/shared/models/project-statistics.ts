export class ProjectStatistics {
  totalSamples: number;
  totalWords: number;

  constructor(data: Object) {
    Object.assign(this, data);
  }
}
