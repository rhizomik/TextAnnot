
export class MetadatafieldValueCounts {
  fieldName: string;
  valueCounts: {[value: string]: number};

  constructor(data: Object) {
    Object.assign(this, data);
  }
}
