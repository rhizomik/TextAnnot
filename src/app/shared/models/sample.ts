import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';
import { MetadataValue } from './metadataValue';
import {TagHierarchy} from './tag-hierarchy';
import {Project} from './project';

export class Sample extends Resource {
  id: number;
  text: string;
  project: Project;
  has: MetadataValue[];
  uri: string;
}

export class FilteredSample extends Sample {
  searchText: string;
  textFragments: TextFragment[];
}

export class TextFragment {
  beforeWord: string;
  word: string;
  afterWord: string;

  constructor(beforeWord: string, word: string, afterWord: string) {
    this.beforeWord = beforeWord;
    this.word = word;
    this.afterWord = afterWord;
  }
}
