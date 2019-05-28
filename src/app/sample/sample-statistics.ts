
export class SampleStatistics {
  occurrences: number;
  samples: number;
  metadataStatistics: MetadataStatistics[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export class MetadataStatistics {
  metadataField: string;
  statistics: ValueStatistic[];
}

export class ValueStatistic {
  value: string;
  statistic: number;
}
