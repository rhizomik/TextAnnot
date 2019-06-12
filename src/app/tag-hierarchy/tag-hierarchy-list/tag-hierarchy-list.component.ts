import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TagHierarchy } from '../../tag-hierarchy/tag-hierarchy';
import { ModalService } from './../../shared/confirm-modal/modal.service';
import { ConfirmModalComponent } from './../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-tag-hierarchy-list',
  templateUrl: './tag-hierarchy-list.component.html',
  styleUrls: ['./tag-hierarchy-list.component.css']
})
export class TagHierarchyListComponent implements OnInit {
  @Input() public tagHierarchies: TagHierarchy[] = [];

  @Output() public deleteItem: EventEmitter<number> = new EventEmitter<number>();

  constructor(private confirmService: ModalService) { }

  ngOnInit() {
  }

  public delete(index: number, $event): void {
    this.confirmService.init(ConfirmModalComponent, {
      title: 'Delete tag hierarchy',
      message: 'Delete tag hierarchy?'
    }).subscribe(
      deleted => {
        if (deleted) {
          this.deleteItem.emit(index);
          $event.stopPropagation();
        }
      }
    );
  }
}
