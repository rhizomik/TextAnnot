import { element, by, ElementArrayFinder, browser } from 'protractor';

export class TagListPage {

  private tag;

  constructor() {
    this.tag = element.all(by.className('card'));
  }

  async getTagInPosition(position: number): Promise<ElementArrayFinder> {
    return await this.tag.get(position - 1);
  }

  async getTagCount(): Promise<number> {
    return await this.tag.count();
  }

  async getTagNames(): Promise<any> {
    return await element.all(by.className('t-name')).map(e => e.getText());
  }

  async deleteTagByName(name: string): Promise<any> {
    const buttons = await element.all(by.className('btn-outline-danger'));
    const names = await element.all(by.className('t-name')).map(e => e.getText());
    await buttons[names.indexOf(name)].click();
  }
}
