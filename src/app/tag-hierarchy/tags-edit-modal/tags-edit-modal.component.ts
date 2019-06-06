import {Component, Input, OnInit} from '@angular/core';
import {TagHierarchy} from "../tag-hierarchy";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TagHierarchyService} from "../tag-hierarchy.service";
import {TagTreeNode} from "../tag-hierarchy-tree";
import {KEYS, TREE_ACTIONS, TreeComponent} from "angular-tree-component";
import {TagService} from "../../tag/tag.service";
import {Tag} from "../../tag/tag";
import {environment} from "../../../environments/environment";
import {flatMap, map} from "rxjs/operators";

@Component({
  selector: 'app-tags-edit-modal-component',
  templateUrl: './tags-edit-modal.component.html',
  styleUrls: ['./tags-edit-modal.component.css']
})
export class TagsEditModalComponent implements OnInit {

  @Input() tagHierarchy: TagHierarchy;

  public nodes: TagTreeNode[];
  public options = {
    animateExpand: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    scrollOnActivate: true,
  };
  private selectedTag: TagTreeNode;
  private newTagName: string;

  constructor(private activeModal: NgbActiveModal,
              private tagHierarchyService: TagHierarchyService,
              private tagService: TagService
              ) { }

  ngOnInit() {
    this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy)
      .subscribe(
        res => {
          this.nodes = res.roots;
        });
  }

  onSelectedNode(tree) {
    this.selectedTag = tree.data;
  }

  setRootParent() {
    this.selectedTag = null;
  }

  submit() {
    const newTag = new Tag();
    newTag.name = this.newTagName;
    newTag.tagHierarchy = this.tagHierarchy;
    this.tagService.get(this.selectedTag.id).pipe(
      flatMap((tag: Tag) => {
        newTag.parent = tag;
        return this.tagService.create(newTag);
      }),
      flatMap(value => {
        return this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy);
      }),
      map(value => this.nodes = value.roots)
    ).subscribe(value => {
      this.newTagName = null;
      this.selectedTag = null;
    });
  }
}
