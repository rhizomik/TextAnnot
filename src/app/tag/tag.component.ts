import {ModalService} from '../shared/confirm-modal/modal.service';
import {TagTreeNode} from '../shared/models/tags-tree';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KEYS, TREE_ACTIONS, TreeComponent} from 'angular-tree-component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TagsEditModalComponent} from './tags-edit-modal/tags-edit-modal.component';
import {ProjectService} from '../core/services/project.service';
import {Project} from '../shared/models/project';
import {TagService} from '../core/services/tag.service';

@Component({
  selector: 'app-tag-hierarchy-detail',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  public project: Project;
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

  @ViewChild('tree') tree: TreeComponent;
  expandedTree = false;

  constructor(
    private route: ActivatedRoute,
    private confirmService: ModalService,
    private router: Router,
    private projectService: ProjectService,
    private tagService: TagService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.project = await this.projectService.getProject();
    this.tagService.getTagHierarchyTree(this.project).subscribe(
      tagsTree => {
        if (tagsTree.roots.length === 0) {
          this.router.navigate(['tags', 'create']);
        } else {
          this.nodes = tagsTree.roots;
          if (this.nodes.length > 0) {
            this.structure = true;
          }
        }
      }
    );
  }

  editTagsModal() {
    const modalRef = this.modalService.open(TagsEditModalComponent, {size: 'lg', centered: true});
  }

  deleteTree() {
    if(confirm('This will remova all Tags and the Annotations done with them. Are you sure you want to remove it?')) {
      this.tagService.deleteAllTags(this.project).subscribe(value => this.router.navigate(['tags', 'create']));
    }
  }

  expandCollapseTree() {
    if (this.expandedTree) {
      this.tree.treeModel.collapseAll();
    } else {
      this.tree.treeModel.expandAll();
    }
    this.expandedTree = !this.expandedTree;
  }
}
