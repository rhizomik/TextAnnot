import { Router } from '@angular/router';
import { ErrorMessageService } from './../../error-handler/error-message.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TagHierarchy } from '../../tag-hierarchy/tag-hierarchy';
import { TagHierarchyService } from '../tag-hierarchy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tag-hierarchy-form',
  templateUrl: './tag-hierarchy-form.component.html',
  styleUrls: ['./tag-hierarchy-form.component.css']
})
export class TagHierarchyFormComponent implements OnInit {

  public tagHierarchy: TagHierarchy;
  public errorMessage: string;
  public formTitle = 'Register Tag Hierarchies';
  public formSubtitle = 'Register a new TagHierarchy';
  @Output() public afterInsert: EventEmitter<TagHierarchy> = new EventEmitter<TagHierarchy>();

  constructor(private tagHierarchyService: TagHierarchyService,
              private modalService: NgbModal,
              private errorService: ErrorMessageService,
              private router: Router) { }

  ngOnInit() {
    this.tagHierarchy = new TagHierarchy();
  }

  onSubmit(): void {
    this.tagHierarchyService.create(this.tagHierarchy)
      .subscribe(
        (res: TagHierarchy) => {
          this.afterInsert.emit(Object.assign({}, res));
          this.tagHierarchy.name = '';
          this.modalService.dismissAll();
        },
        () => this.errorService.showErrorMessage('Error creating Tag Hierarchy'));

  }

  toQuickCreation() {
    this.router.navigate(['/tagHierarchies', 'quick-creation']);
    this.modalService.dismissAll();
  }

  open(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

}
