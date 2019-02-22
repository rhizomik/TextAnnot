import { ConfirmModalComponent } from './../../shared/confirm-modal/confirm-modal.component';
import { ModalService } from './../../shared/confirm-modal/modal.service';
import { TagTreeNode } from './../tag-hierarchy-tree';
import { Component, OnInit } from '@angular/core';
import { TagHierarchy } from '../tag-hierarchy';
import { ActivatedRoute, Router } from '@angular/router';
import { TagHierarchyService } from '../tag-hierarchy.service';
import { TREE_ACTIONS, KEYS } from 'angular-tree-component';

@Component({
  selector: 'app-tag-hierarchy-detail',
  templateUrl: './tag-hierarchy-detail.component.html',
  styleUrls: ['./tag-hierarchy-detail.component.css']
})
export class TagHierarchyDetailComponent implements OnInit {

  public tagHierarchy: TagHierarchy;
  public errorMessage: string;
  public formTitle = ' details';
  public formSubtitle = 'Taghierarchy details page';
  public nodes: TagTreeNode[];
  public structure: Boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private confirmService: ModalService,
    private router: Router,
    private tagHierarchyService: TagHierarchyService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.tagHierarchyService.get(id).subscribe(
      tagHierarchyObj => {
        this.tagHierarchy = tagHierarchyObj;
        this.formTitle = tagHierarchyObj.name + this.formTitle;
        this.tagHierarchyService.getTagHierarchyTree(this.tagHierarchy).subscribe(
          res => {
            this.nodes = res.roots;
            if (this.nodes.length > 0) {
              this.structure = true;
            }
          }
        );
      }
    );
  }

  public delete() {
    this.confirmService.init(ConfirmModalComponent, {
      title: 'Delete tag hierarchy',
      message: 'Delete tag hierarchy?'
    }).subscribe(
      deleted => {
        if (deleted) {
          this.tagHierarchyService.delete(this.tagHierarchy).subscribe(
            () => this.router.navigateByUrl('/tagHierarchies')
          );
        }
      }
    );
  }
}
