import { binding, given, when, then } from 'cucumber-tsflow';
import { TagListPage } from './../../../pages/tag/tag-list.page';

@binding()
class DeleteTagHierarchySteps {
  private tagHierarchyList = new TagListPage();

  @when(/^I delete the tag hierarchy with name "([^"]*)"$/)
  async createTagHierarchyWithName(name: string): Promise<void> {
    await this.tagHierarchyList.deleteTagByName(name);
  }
}

export = DeleteTagHierarchySteps;
