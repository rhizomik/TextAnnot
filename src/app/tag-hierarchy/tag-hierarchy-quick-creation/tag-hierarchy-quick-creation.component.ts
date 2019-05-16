import { ErrorMessageService } from './../../error-handler/error-message.service';
import { TagHierarchyService } from './../tag-hierarchy.service';
import { TagHierarchy } from './../tag-hierarchy';
import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { TreeComponent, TREE_ACTIONS, KEYS } from 'angular-tree-component';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AuthenticationBasicService} from '../../login-basic/authentication-basic.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tag-hierarchy-quick-creation',
  templateUrl: './tag-hierarchy-quick-creation.component.html',
  styleUrls: ['./tag-hierarchy-quick-creation.component.css']
})
export class TagHierarchyQuickCreationComponent implements OnInit {

  public formTitle = 'Create TagHierarchy';
  public formSubtitle = 'Create TagHierarchy in a single shot';
  public tagHierarchyName = '';
  uploader: FileUploader;
  uploading = false;

  private id = 0;

  public newNodes = [];
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

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private location: Location,
              private tagHierarchyService: TagHierarchyService,
              private errorService: ErrorMessageService,
              private authentication: AuthenticationBasicService,
              private router: Router) { }

  ngOnInit() {
    this.newNodes = [];
    this.tagHierarchyName = '';
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${environment.API}/quickTagHierarchyCreate`,
      authToken: this.authentication.getCurrentUser().authorization
    });
  }

  public onSubmit(): void {
    const body = {
      name: this.tagHierarchyName,
      roots: this.newNodes
    };

    this.tagHierarchyService.createTagHierarchyInASingleShot(body).subscribe(
      () => this.location.back(),
      err => this.errorService.showErrorMessage(err)
    );
  }

  public goBack(): void {
    this.location.back();
  }

  public addChildren(node): void {
    node.data.children.push({
      id: this.id,
      name: '',
      children: []
    });
    this.tree.treeModel.update();
    const someNode = this.tree.treeModel.getNodeById(node.data.id);
    someNode.expand();
    this.id++;
  }

  public addRoot(): void {
    this.newNodes.push({
      id: this.id,
      name: 'new_root',
      children: []
    });
    this.tree.treeModel.update();
    this.id++;
  }

  public deleteNode(id: string): void {
    this.deleteNodesRec(this.newNodes, id);
    this.tree.treeModel.update();
  }

  private deleteNodesRec(nodes: any[], id: string) {
    const index = nodes.findIndex(n => n.id === id);
    if (index >= 0) {
      nodes.splice(index, 1);
      return;
    }

    for (let i = 0; i < nodes.length; i++) {
      this.deleteNodesRec(nodes[i].children, id);
    }
  }

  createFromFile() {
    this.uploading = true;
    this.uploader.options.additionalParameter = {tagHierarchyName: this.tagHierarchyName};
    this.uploader.queue[0].onComplete = (response: string, status: number, headers: any) => {
      const responseObject = JSON.parse(response);
      if (status !== 201) {
        this.errorService.showErrorMessage(`Something went wrong: ${responseObject['message']}`);
        this.uploader.queue[0].isUploaded = false;
      } else {
        this.router.navigate(['tagHierarchies', responseObject['id'], 'detail']);
      }
      this.uploading = false;
    };
    this.uploader.uploadAll();
  }
}
