import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {MetadataField} from '../metadata-field';
import { MetadataFieldService } from '../metadata-field.service';
import {MetadataTemplate} from '../../metadata-template/metadata-template';
import {MetadataTemplateService} from '../../metadata-template/metadata-template.service';
import {flatMap, map} from "rxjs/operators";

@Component({
  selector: 'app-metadatafield-edit',
  templateUrl: './metadatafield-edit.component.html'
})
export class MetadatafieldEditComponent implements OnInit {
  public metadataField: MetadataField;
  public errorMessage: string;
  public formTitle = 'Edit metadataField';
  public formSubtitle = 'Edit the value of a metadataField';
  public metadataTemplates: MetadataTemplate[] = [];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private metadatafieldService: MetadataFieldService,
              private metadataFieldService: MetadataFieldService, private metadataTemplateService: MetadataTemplateService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.metadatafieldService.get(id).pipe(
      flatMap((metadataField: MetadataField) => {
        this.metadataField = metadataField;
        return metadataField.getRelation(MetadataTemplate, 'definedAt')
      }))
      .subscribe((metadataTemplate: MetadataTemplate)=> {
        this.metadataField.definedAt = metadataTemplate;
        console.log(metadataTemplate);
      });
    this.metadataTemplateService.getAll().subscribe(
      (metadataTemplates: MetadataTemplate[]) => {
        this.metadataTemplates = metadataTemplates;
      }
    );

  }

  compareTemplates(a: MetadataTemplate, b: MetadataTemplate) {
    return a.id === b.id;
  }

  onSubmit(): void {
    this.metadatafieldService.update(this.metadataField)
      .subscribe(
        (metadatafield: MetadataField) => this.router.navigate([metadatafield.uri]));
  }
}
