import { TagHierarchyService } from './../tag-hierarchy.service';
import { TagHierarchy } from '../../tag-hierarchy/tag-hierarchy';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag-hierarchy-search',
  templateUrl: './tag-hierarchy-search.component.html',
  styleUrls: ['./tag-hierarchy-search.component.css']
})
export class TagHierarchySearchComponent implements OnInit {

  @Output()
  emitResults: EventEmitter<TagHierarchy[]> = new EventEmitter();

  public errorMessage: string;
  constructor(private tagHierarchyService: TagHierarchyService) {
  }

  ngOnInit() {
  }

  doSearch(searchTerm: string): void {
    this.tagHierarchyService.findByNameContaining(searchTerm).subscribe(
      tagHierarchies => this.emitResults.emit(tagHierarchies));
  }
}
