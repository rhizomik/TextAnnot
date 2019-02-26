export class AnnotationFilter {
  searchText: string;
  selectedTagsIds: Set<number>;
  constructor(searchText: string, selectedTagsIds: Set<number>) {
    this.searchText = searchText;
    this.selectedTagsIds = selectedTagsIds;
  }
}
