
export class SampleStatistics {
  occurrences: number;
  samples: number;
  metadataStatistics: MetadataStatistics[];

  constructor(data: Object) {
    Object.assign(this, data);
    this.metadataStatistics = []
    for (const metadataStatistic in data['metadataStatistics']) {
      this.metadataStatistics.push(new MetadataStatistics(metadataStatistic, data['metadataStatistics'][metadataStatistic]));
    }
  }
}

export class MetadataStatistics {
  metadataField: string;
  statistics: ValueStatistic[];
  constructor(field: string, statistics: Object) {
    this.metadataField = field;
    this.statistics = [];
    for (const statistic in statistics) {
      this.statistics.push(new ValueStatistic(statistic, statistics[statistic]));
    }
    this.statistics.sort((a, b) => b.statistic - a.statistic);
  }
}

export class ValueStatistic {
  value: string;
  statistic: number;

  constructor(value: string, statistic: number) {
    this.value = value;
    this.statistic = statistic;
  }
}
