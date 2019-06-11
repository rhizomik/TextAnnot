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
import {forkJoin, of} from 'rxjs';

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
  public selectedTag: TagTreeNode;
  public newTagName: string;
  public tagToModify: TagTreeNode;
  public renaming = false;
  public changingParent = false;
  public newTagParent: TagTreeNode;


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

  onSelectedParent(tree) {
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

  onSelectedTagToModif(tree) {
    this.tagToModify = tree.data;
    this.newTagName = this.tagToModify.name;
  }

  onNewParentSelected(tree) {
    this.newTagParent = tree.data;
  }

  setChangingParent() {
    this.changingParent = true;
  }

  setNewRootParent() {
    this.newTagParent = null;
  }

  setRenaming() {
    this.renaming = true;
  }

  submitModify() {
    const newTag = new Tag();
    if (this.renaming) {
      newTag.id = this.tagToModify.id;
      newTag.name = this.newTagName;
      this.tagService.get(this.tagToModify.id).pipe(
        flatMap(tag => {
          tag.name = this.newTagName;
          return this.tagService.update(tag);
        })
      ).subscribe(tagsTree => {
        this.tagToModify.name = this.newTagName; // modify tree
        this.renaming = this.changingParent = false;
      });
    } else {
      if (this.newTagParent) {
        forkJoin(this.tagService.get(this.tagToModify.id), this.tagService.get(this.newTagParent.id)).pipe(
          flatMap(([tag, parent]) => {
            tag.parent = parent;
            return tag.substituteRelation('parent', parent);
          }),
          flatMap(tag => this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy))
        ).subscribe(tagsTree => {
          this.renaming = this.changingParent = false;
          this.newTagParent = null;
          this.nodes = tagsTree.roots;
        });
      } else {
        this.tagService.get(this.tagToModify.id).pipe(
          flatMap(tag => forkJoin(of(tag), tag.getRelation(Tag, 'parent'))),
          flatMap(([tag, parent]) => tag.deleteRelation('parent', parent)),
          flatMap(tag => this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy))
        ).subscribe(tagsTree => {
          this.renaming = this.changingParent = false;
          this.newTagParent = null;
          this.nodes = tagsTree.roots;
        });
      }

    }
  }

  cancelModify() {
    this.renaming = this.changingParent = false;
  }
}
