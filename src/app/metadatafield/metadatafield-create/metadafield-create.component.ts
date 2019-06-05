import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataFieldService } from '../metadata-field.service';
import { MetadataField } from '../metadata-field';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import { MetadataTemplateService } from '../../metadata-template/metadata-template.service';



@Component({
  selector: 'app-metadatafield-create',
  templateUrl: '../metadatafield-edit/metadatafield-edit.component.html'
})
export class MetadafieldCreateComponent implements OnInit {
  public metadataField: MetadataField;
  public errorMessage: string;
  public formTitle = 'Create MetadataField';
  public formSubtitle = 'Creates a new metadataField';
  public metadataTemplates: MetadataTemplate[] = [];

  constructor(private router: Router,
              private metadatafieldService: MetadataFieldService, private metadataTemplateService: MetadataTemplateService) { }

  ngOnInit() {
    this.metadataField = new MetadataField();
    this.metadataTemplateService.getAll().subscribe(
      (metadataTemplates: MetadataTemplate[]) => {
        this.metadataTemplates = metadataTemplates;
      }
    );
  }

  compareTemplates(a: MetadataTemplate, b: MetadataTemplate) {
    if (a && b){
      return a.id === b.id;
    }
    return false;
  }

  onSubmit(): void {
    this.metadatafieldService.create(this.metadataField)
      .subscribe(
        () => this.router.navigate(['/metadataFields']));

  }
}
