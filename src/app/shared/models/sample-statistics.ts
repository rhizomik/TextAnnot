export class ValueStatistic {
  value: string;
  absoluteFreq: number;
  relativeFreq: number;
  globalRelativeFreq: number;

  constructor(value: string, absoluteFreq: number, relativeFreq: number, globalRelativeFreq: number) {
    this.value = value;
    this.absoluteFreq = absoluteFreq;
    this.relativeFreq = relativeFreq;
    this.globalRelativeFreq = globalRelativeFreq;
  }
}

export class MetadataStatistics {
  metadataField: string;
  statistics: ValueStatistic[];
  simpleStatistic: boolean;
  constructor(field: string, statistics: Object, globalStatistics: Object, occurrences: number, samplesCount: number,
              totalOccurrences: number) {
    this.metadataField = field;
    this.statistics = [];
    if (Object.keys(statistics).every(value => ['Max', 'Min', 'Avg'].includes(value))) {
      this.statistics.push(new ValueStatistic('Min', statistics['Min'], 0, 0));
      this.statistics.push(new ValueStatistic('Max', statistics['Max'], 0, 0));
      this.statistics.push(new ValueStatistic('Avg', statistics['Avg'], 0, 0));
      this.simpleStatistic = true;
    } else {
      for (const statistic in statistics) {
        const relativeFreq = Math.round(1000 * statistics[statistic] / occurrences) / 10;
        const globalRelativeFreq = Math.round(1000 * globalStatistics[statistic] / totalOccurrences) / 10;
        this.statistics.push(new ValueStatistic(statistic, statistics[statistic],
          relativeFreq, globalRelativeFreq));
      }
      this.simpleStatistic = false;
      this.statistics.sort((a, b) => b.absoluteFreq - a.absoluteFreq);
    }
  }
}

export class SampleStatistics {
  occurrences: number;
  samples: number;
  totalOccurrences: number;
  totalSamples: number;
  metadataStatistics: MetadataStatistics[];

  constructor(data: Object) {
    Object.assign(this, data);
    this.metadataStatistics = [];
    for (const metadataStatistic in data['metadataStatistics']) {
      this.metadataStatistics.push(new MetadataStatistics(metadataStatistic, data['metadataStatistics'][metadataStatistic],
        data['globalMetadataStatistics'][metadataStatistic], this.occurrences, this.samples, this.totalOccurrences));
    }
  }
}
