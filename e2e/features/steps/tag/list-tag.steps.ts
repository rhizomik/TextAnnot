import { TagListPage } from './../../../pages/tag/tag-list.page';
import { binding, given, when, then } from 'cucumber-tsflow';
import { expect } from 'chai';

@binding()
class ListTagSteps {
  private tagList = new TagListPage();

  @then(/^I see (\d+) tags/)
  async iSeeTagHierarchies(count: number): Promise<void> {
    expect(await this.tagList.getTagCount()).to.equal(count);
  }
}

export = ListTagSteps;
