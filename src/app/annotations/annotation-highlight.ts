export class AnnotationHighlight {
  id: number;
  pos: number;
  starting: boolean;

  constructor(values) {
    Object.assign(this, values);
  }
}
