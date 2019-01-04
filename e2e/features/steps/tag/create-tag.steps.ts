import { browser } from 'protractor';
import { TagHierarchyListPage } from './../../../pages/tag-hierarchy/tag-hierarchy-list.page';
import { binding, when, then } from 'cucumber-tsflow';
import { TagHierarchyPopUpPage } from './../../../pages/tag-hierarchy/tag-hierarchy-popup.page';
import { TagListPage } from './../../../pages/tag/tag-list.page';
import { TagPopUpPage } from './../../../pages/tag/tag-popup.page';
import { expect } from 'chai';

@binding()
class CreateTagSteps {

  private tagHierarchyForm = new TagHierarchyPopUpPage();
  private tagHierarchyList = new TagHierarchyListPage();
  private tagForm = new TagPopUpPage();
  private tagList = new TagListPage();

  @when(/^I create a tag hierarchy with name "([^"]*)"$/)
  async createTagHierarchyWithName(th: string): Promise<void> {
    await this.tagHierarchyForm.clickCreateButton();
    await this.tagHierarchyForm.inputName(th);
  }

  @then(/^a tag hierarchy with name "([^"]*)" is present$/)
  async tagHierarchyIsPresent(name: string): Promise<void> {
    const names = await this.tagHierarchyList.getTagHierarchiesNames();
    expect(names.includes(name)).to.equal(true);
  }

  @when(/^I click the submit button$/)
  async submitTagHierarchy(): Promise<void> {
    await this.tagHierarchyForm.clickSubmitButton();
  }

  @when(/^I create a tag with name "([^"]*)" and tag hierarchy "([^"]*)" and parent "([^"]*)"$/)
  async createTagWithName(name: string, th: string, parent: string): Promise<void> {
    await this.tagForm.clickCreateButton();
    await this.tagForm.inputName(name);
    await this.tagForm.inputTagHierarchy(th);
    await this.tagForm.inputParentTag(parent);
  }

  @then(/^a tag with name "([^"]*)" is present$/)
  async tagIsPresent(name: string): Promise<void> {
    const names = await this.tagList.getTagNames();
    expect(names.includes(name)).to.equal(true);
  }

  @when(/^I click the submit button$/)
  async submitTag(): Promise<void> {
    await this.tagForm.clickSubmitButton();
  }

}

export = CreateTagSteps;
