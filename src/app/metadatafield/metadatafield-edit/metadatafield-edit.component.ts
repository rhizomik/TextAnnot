import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {MetadataField} from '../metadata-field';
import { MetadataFieldService } from '../metadata-field.service';
import {MetadataTemplate} from '../../metadata-template/metadata-template';
import {MetadataTemplateService} from '../../metadata-template/metadata-template.service';

@Component({
  selector: 'app-metadatafield-edit',
  templateUrl: '../metadatafield-form/metadatafield-form.component.html'
})
export class MetadatafieldEditComponent implements OnInit {
  public metadatafield: MetadataField;
  public errorMessage: string;
  public formTitle = 'Edit metadatafield';
  public formSubtitle = 'Edit the value of a metadatafield';
  public metadataTemplates: MetadataTemplate[] = [];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private metadatafieldService: MetadataFieldService,
              private metadataField: MetadataFieldService, private metadataTemplateService: MetadataTemplateService) {
  }

  ngOnInit() {
    this.metadatafield = new MetadataField();
    const id = this.route.snapshot.paramMap.get('id');
    this.metadatafieldService.get(id).subscribe(
      metadatafield => this.metadatafield = metadatafield);
    this.metadataTemplateService.getAll().subscribe(
      (metadataTemplates: MetadataTemplate[]) => {
        this.metadataTemplates = metadataTemplates;
      }
    );

  }

  onSubmit(): void {
    this.metadatafieldService.update(this.metadatafield)
      .subscribe(
        (metadatafield: MetadataField) => this.router.navigate([metadatafield.uri]));
  }
}
