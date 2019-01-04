import { element, by, ElementArrayFinder, browser } from 'protractor';

export class TagPopUpPage {

  async inputName(name: string): Promise<void> {
    await element(by.name('name')).sendKeys(name);
  }

  async inputTagHierarchy(name: string): Promise<void> {
    await element(by.name('tagHierarchySelect')).sendKeys(name);
  }

  async inputParentTag(name: string): Promise<void> {
    await element(by.name('parentSelect')).sendKeys(name);
  }

  async clickCreateButton(): Promise<void> {
    await element(by.id('add-tag')).click();
  }

  async clickSubmitButton(): Promise<void> {
    await element(by.id('submit')).click();
  }
}
