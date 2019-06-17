import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Linguist} from '../../shared/models/linguist';
import {LinguistService} from '../../core/services/linguist.service';

@Component({
  selector: 'app-linguist-search',
  templateUrl: './user-search.component.html'
})

export class LinguistSearchComponent {
  @Input()
  linguists: Linguist[];
  @Output()
  emitResults: EventEmitter<any> = new EventEmitter();

  public errorMessage: string;

  constructor(private linguistService: LinguistService) {
  }

  performSearch(searchTerm: string): void {
    this.linguistService.findByUsernameContaining(searchTerm).subscribe(
      linguists => {
        this.emitResults.emit(linguists);
      });
  }
}

