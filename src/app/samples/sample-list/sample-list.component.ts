import { Component, OnInit } from '@angular/core';
import { SampleService} from '../sample.service';
import { Sample } from '../sample';
import {MetadataValue} from '../../metadataValue/metadataValue';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  public samples: Sample[] = [];

  constructor(private sampleService: SampleService) { }

  ngOnInit() {
    this.sampleService.getAll().subscribe(
      (samples: Sample[]) => {
        this.samples = samples;
        this.samples.map(
          (sample: Sample) => {
            sample.getRelationArray(MetadataValue, 'has').subscribe(
              (values: MetadataValue[]) => {
                sample.has = values;
                console.log(values);
              }
            );
          }
        );
      });
  }

}
