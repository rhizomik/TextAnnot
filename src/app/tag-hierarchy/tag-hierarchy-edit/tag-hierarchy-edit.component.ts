import { TagHierarchyService } from './../tag-hierarchy.service';
import { TagHierarchy } from '../../tag-hierarchy/tag-hierarchy';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-tag-hierarchy-edit',
  templateUrl: './tag-hierarchy-edit.component.html',
  styleUrls: ['./tag-hierarchy-edit.component.css']
})
export class TagHierarchyEditComponent implements OnInit {

  public tagHierarchy: TagHierarchy;
  public errorMessage: string;
  public formTitle = 'Edit taghierarchy';
  public formSubtitle = 'Edit the value of a taghierarchy';
  public tagHierarchies: TagHierarchy[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private tagHierarchyService: TagHierarchyService
  ) { }

  ngOnInit() {
    this.tagHierarchy = new TagHierarchy();
    const id = this.route.snapshot.paramMap.get('id');
    this.tagHierarchyService.get(id).subscribe(
      tagHierarchyObj => this.tagHierarchy = tagHierarchyObj);
    this.tagHierarchyService.getAll().subscribe(
      (tagHierarchies: TagHierarchy[]) => {
        this.tagHierarchies = tagHierarchies;
      }
    );
  }

  onSubmit(): void {
    this.tagHierarchyService.update(this.tagHierarchy)
      .subscribe(
        (tagHierarchy: TagHierarchy) => this.router.navigate(['tagHierarchies']));
  }

  goBack() {
    this.location.back();
  }
}

