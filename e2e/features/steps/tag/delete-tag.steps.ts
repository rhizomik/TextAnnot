import { binding, given, when, then } from 'cucumber-tsflow';
import { TagListPage } from './../../../pages/tag/tag-list.page';

@binding()
class DeleteTagSteps {
  private tagList = new TagListPage();

  @when(/^I delete the tag with name "([^"]*)"$/)
  async deleteTagWithName(name: string): Promise<void> {
    await this.tagList.deleteTagByName(name);
  }
}

export = DeleteTagSteps;
