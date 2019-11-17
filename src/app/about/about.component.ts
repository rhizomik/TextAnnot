import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit() {
  }
}
