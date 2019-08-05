export class ProjectValueStatistic {
  value: string;
  absoluteFreq: number;

  constructor(value: string, absoluteFreq: number) {
    this.value = value;
    this.absoluteFreq = absoluteFreq;
  }
}

export class ProjectMetadataStatistics {
  metadataField: string;
  statistics: ProjectValueStatistic[];
  constructor(field: string, statistics: Object) {
    this.metadataField = field;
    this.statistics = [];
    for (const statistic in statistics) {
      this.statistics.push(new ProjectValueStatistic(statistic, statistics[statistic]));
    }
    this.statistics.sort((a, b) => b.absoluteFreq - a.absoluteFreq);
  }
}

export class ProjectStatistics {
  totalSamples: number;
  totalWords: number;
  annotatedSamples: number;
  totalAnnotations: number;
  metadataStatistics: ProjectMetadataStatistics[];

  constructor(data: Object) {
    Object.assign(this, data);
    this.metadataStatistics = [];
    for (const metadataStatistic in data['metadataStatistics']) {
      this.metadataStatistics.push(new ProjectMetadataStatistics(metadataStatistic, data['metadataStatistics'][metadataStatistic]));
    }
  }
}
