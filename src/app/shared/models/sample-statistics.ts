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
  constructor(field: string, statistics: Object, globalStatistics: Object, samplesCount: number, totalSamplesCount: number) {
    this.metadataField = field;
    this.statistics = [];
    for (const statistic in statistics) {
      const relativeFreq = Math.round(1000 * statistics[statistic] / samplesCount) / 1000;
      const globalRelativeFreq = Math.round(1000 * globalStatistics[statistic] / totalSamplesCount) / 1000;
      this.statistics.push(new ValueStatistic(statistic, statistics[statistic],
         relativeFreq, globalRelativeFreq));
    }
    this.statistics.sort((a, b) => b.absoluteFreq - a.absoluteFreq);
  }
}

export class AnnotationStatistic {
  tag: string;
  occurrences: number;
  samples: number;
  globalSamples: number;
}

export class SampleStatistics {
  occurrences: number;
  samples: number;
  totalSamples: number;
  metadataStatistics: MetadataStatistics[];
  annotationStatistics: AnnotationStatistic[];

  constructor(data: Object) {
    Object.assign(this, data);
    this.metadataStatistics = [];
    for (const metadataStatistic in data['metadataStatistics']) {
      this.metadataStatistics.push(new MetadataStatistics(metadataStatistic, data['metadataStatistics'][metadataStatistic],
        data['globalMetadataStatistics'][metadataStatistic], this.samples, this.totalSamples));
    }
  }
}
