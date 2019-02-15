export class TextSelection {
  text: string;
  start: number;
  end: number;

  constructor(values) {
    Object.assign(this, values);
  }
}
