import { forkJoin } from 'rxjs/index';
import { flatMap } from 'rxjs/operators';
import { ErrorMessageService } from './../../error-handler/error-message.service';
import { TagHierarchyService } from './../../tag-hierarchy/tag-hierarchy.service';
import { TagHierarchy } from '../../tag-hierarchy/tag-hierarchy';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Tag } from '../tag';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '../tag.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Location} from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.css']
})
export class TagEditComponent implements OnInit {
  public tag: Tag;
  public tagHierName: string;
  public parentTagName: string;
  public tagParent: Tag[];
  public tagHierarchy: TagHierarchy[];
  public errorMessage: string;
  public formTitle = 'Create Tag';
  public formSubtitle = 'Create a new Tag';
  public uriTagHierarchy: string;
  public uriTag: string;
  public tHierarchy: TagHierarchy;
  @Output() public afterInsert: EventEmitter<Tag> = new EventEmitter<Tag>();
  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private tagService: TagService,
              private modalService: NgbModal,
              private tagHierarchyService: TagHierarchyService,
              private errorService: ErrorMessageService) { }

  ngOnInit() {
    this.tag = new Tag();
    const id = this.route.snapshot.paramMap.get('id');
    this.tagService.get(id).subscribe(
      tagElem => this.tag = tagElem
    );

    this.tagHierarchyService.getAll().subscribe(
      tagHierarchies => this.tagHierarchy = tagHierarchies
    );
  }

  onSubmit(): void {
    this.tagService.patch(this.tag)
    .subscribe(
      (updatedTag: Tag) => {
        updatedTag.getRelation(TagHierarchy, 'tagHierarchy')
        .subscribe((tHierarchy: TagHierarchy) => this.tag.tagHierarchy = tHierarchy);

        if (updatedTag.parent == null) {
          updatedTag.deleteRelation('parent', updatedTag).subscribe();
        } else {
          updatedTag.getRelation(Tag, 'parent')
          .subscribe((tparent: Tag) => {
              this.tag.parent = tparent;
          });
        }

        this.router.navigate(['/tags']);
      },
      () => this.errorService.showErrorMessage('Error updating Tag'));
}

  optionSelectedth(val: any) {
    this.tag.tagHierarchy = this.tagHierarchy[val];
    this.changeSelectedParentTag(val);
  }

  changeSelectedParentTag(val: any) {
    this.tagService.findByTagHierarchy(this.tagHierarchy[val]).subscribe(
      res => {
          this.tagParent = res;
      }
    );
  }
  optionSelectedt(val: number) {
    if (val === -1) {
      this.tag.parent = null;
    } else {
      this.tag.parent = this.tagParent[val];
    }
  }
  letsGoBack() {
    this.location.back();
  }
}

