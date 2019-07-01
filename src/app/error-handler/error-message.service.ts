import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class ErrorMessageService {

  private errorMessageSource = new Subject<string>();

  errorMessage$ = this.errorMessageSource.asObservable();

  disabled = false;

  constructor() {
  }

  showErrorMessage(errorMessage: string) {
    if (!this.disabled) {
      this.errorMessageSource.next(errorMessage);
    }
  }

  disableErrorsHandler() {
    this.disabled = true;
  }

  enableErrorsHandler() {
    this.disabled = false;
  }
}
