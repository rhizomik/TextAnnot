import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {TagTreeNode} from '../../../tag-hierarchy/tag-hierarchy-tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {faAngleDown, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {TagHierarchyService} from '../../../tag-hierarchy/tag-hierarchy.service';
import {TagHierarchy} from '../../../tag-hierarchy/tag-hierarchy';
import {AnnotationFilter} from './annotation-filter';

@Component({
  selector: 'app-annotation-list-filter',
  templateUrl: './annotation-list-filter.component.html',
  styleUrls: ['./annotation-list-filter.component.css']
})
export class AnnotationListFilterComponent implements OnInit {

  faAngleDown = faAngleDown;
  faAngleRight = faAngleRight;

  public tags: TagTreeNode[];
  @Input() tagHierarchy: TagHierarchy;
  @Output() filters = new EventEmitter<AnnotationFilter>();

  selectedTagsIds = new Set<number>();
  searchText = '';

  treeControl = new NestedTreeControl<TagTreeNode>(dataNode => dataNode.children);
  dataSource = new MatTreeNestedDataSource<TagTreeNode>();
  checklist = new SelectionModel<TagTreeNode>(true);

  constructor(
    private tagHierarchyService: TagHierarchyService,
    ) { }

  ngOnInit() {

    this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy)
      .subscribe(value => {
        this.tags = value.roots;
        this.dataSource.data = this.tags;
      });
  }

  onTextInput(text: string) {
    if (text.length >= 2) {
      this.filters.emit(new AnnotationFilter(this.searchText, this.selectedTagsIds));
    }
  }

  toggleNode(node: TagTreeNode) {
    this.checklist.toggle(node);
    if (this.checklist.isSelected(node)) {
      this.selectedTagsIds.add(node.id);
      this.treeControl.getDescendants(node).forEach(value => {
        this.checklist.select(value);
        this.selectedTagsIds.add(value.id);
      });
    } else {
      this.selectedTagsIds.delete(node.id);
      this.treeControl.getDescendants(node).forEach(value => {
        this.checklist.deselect(value);
        this.selectedTagsIds.delete(value.id);
      });
    }
    this.filters.emit(new AnnotationFilter(this.searchText, this.selectedTagsIds));
  }

  selectNode(node: TagTreeNode) {
    this.filters.emit(new AnnotationFilter(this.searchText, this.selectedTagsIds));
  }

  hasChild = (_: number, node: TagTreeNode) => !!node.children && node.children.length > 0;

}
