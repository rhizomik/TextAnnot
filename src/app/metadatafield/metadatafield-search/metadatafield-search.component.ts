import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MetadataField} from '../../shared/models/metadata-field';
import { MetadataFieldService } from '../../core/services/metadata-field.service';

@Component({
  selector: 'app-metadatafield-search',
  templateUrl: './metadatafield-search.component.html',
  styleUrls: ['./metadatafield-search.component.css']
})
export class MetadatafieldSearchComponent {
  @Input()
  metadata: MetadataField[];
  @Output()
  emitResults: EventEmitter<any> = new EventEmitter();

  public errorMessage: string;
  constructor(private patata: MetadataFieldService) {
  }

  performSearch(searchTerm: string): void {
    this.patata.getMetadataFieldsByUsername(searchTerm).subscribe(
      metadata => { this.emitResults.emit(metadata); });
  }
}
