import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import {Xliff} from '@angular/compiler';

declare const require;
const content = require('raw-loader!../../../i18n/messages.es.xlf');

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly xliff: any = new Xliff().load(content, '');

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

  get(key: string): string {
    if (this.locale.includes('es') &&
        this.xliff.i18nNodesByMsgId[key]) {
      return this.xliff.i18nNodesByMsgId[key][0].value;
    } else {
      return key;
    }
  }
}
