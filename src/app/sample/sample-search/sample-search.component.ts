import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Sample } from '../sample';
import { SampleService} from '../sample.service';
import { MetadataTemplate } from '../../metadata-template/metadata-template';


@Component({
  selector: 'app-sample-search',
  templateUrl: './sample-search.component.html',
  styleUrls: ['./sample-search.component.css']
})
export class SampleSearchComponent {
  @Input()
  samples: Sample[];
  @Output()
  emitResults: EventEmitter<any> = new EventEmitter();

  public errorMessage: string;
  constructor(private sampleService: SampleService) {
  }

  performSearch(searchTerm: string): void {
    if (searchTerm.length < 5) {
      return;
    }
    this.sampleService.findByTextContaining(searchTerm).subscribe(
      samples => {
        // Get the metadata template for each sample
        samples.map(
          (sample: Sample) => {
            sample.getRelation(MetadataTemplate, 'describedBy').subscribe(
              (metadataTemplate: MetadataTemplate) => sample.describedBy = metadataTemplate
            );
          }
        );
        this.emitResults.emit(samples);
      });
  }
}
