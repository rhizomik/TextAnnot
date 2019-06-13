import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TagTreeNode} from '../../shared/modal/tags-tree';
import {KEYS, TREE_ACTIONS} from 'angular-tree-component';
import {TagService} from '../tag.service';
import {Tag} from '../tag';
import {flatMap, map} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {ProjectService} from '../../core/project.service';
import {Project} from '../../shared/modal/project';

@Component({
  selector: 'app-tags-edit-modal-component',
  templateUrl: './tags-edit-modal.component.html',
  styleUrls: ['./tags-edit-modal.component.css']
})
export class TagsEditModalComponent implements OnInit {

  private project: Project;

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
              private projectService: ProjectService,
              private tagService: TagService
              ) { }

  async ngOnInit() {
    this.project = await this.projectService.getProject();
    this.tagService.getTagHierarchyTree(this.project)
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
    newTag.project = this.project;
    this.tagService.get(this.selectedTag.id).pipe(
      flatMap((tag: Tag) => {
        newTag.parent = tag;
        return this.tagService.create(newTag);
      }),
      flatMap(value => {
        return this.tagService.getTagHierarchyTree(this.project);
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
          flatMap(tag => this.tagService.getTagHierarchyTree(this.project))
        ).subscribe(tagsTree => {
          this.renaming = this.changingParent = false;
          this.newTagParent = null;
          this.nodes = tagsTree.roots;
        });
      } else {
        this.tagService.get(this.tagToModify.id).pipe(
          flatMap(tag => forkJoin(of(tag), tag.getRelation(Tag, 'parent'))),
          flatMap(([tag, parent]) => tag.deleteRelation('parent', parent)),
          flatMap(tag => this.tagService.getTagHierarchyTree(this.project))
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
