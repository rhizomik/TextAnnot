import { Injectable } from '@angular/core';
import { Resource } from 'angular4-hal-aot';
import { MetadataValue } from '../metadataValue/metadataValue';
import {TagHierarchy} from '../tag-hierarchy/tag-hierarchy';
import {Project} from '../shared/modal/project';

export class Sample extends Resource {
  id: number;
  text: string;
  project: Project;
  has: MetadataValue[];
  taggedBy: TagHierarchy;
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
