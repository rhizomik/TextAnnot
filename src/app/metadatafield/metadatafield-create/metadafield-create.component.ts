import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataFieldService } from '../metadata-field.service';
import { MetadataField } from '../metadata-field';
import { MetadataTemplate } from '../../metadata-template/metadata-template';
import { MetadataTemplateService } from '../../metadata-template/metadata-template.service';



@Component({
  selector: 'app-metadatafield-create',
  templateUrl: '../metadatafield-edit/metadatafield-form.component.html'
})
export class MetadafieldCreateComponent implements OnInit {
  public metadatafield: MetadataField;
  public errorMessage: string;
  public formTitle = 'Create MetadataField';
  public formSubtitle = 'Creates a new metadataField';
  public metadataTemplates: MetadataTemplate[] = [];

  constructor(private router: Router,
              private metadatafieldService: MetadataFieldService, private metadataTemplateService: MetadataTemplateService) { }

  ngOnInit() {
    this.metadatafield = new MetadataField();
    this.metadataTemplateService.getAll().subscribe(
      (metadataTemplates: MetadataTemplate[]) => {
        this.metadataTemplates = metadataTemplates;
      }
    );
  }

  onSubmit(): void {
    this.metadatafieldService.create(this.metadatafield)
      .subscribe(
        () => this.router.navigate(['/metadataFields']));

  }
}
