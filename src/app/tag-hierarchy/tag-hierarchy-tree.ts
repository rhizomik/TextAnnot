
export interface TagHierarchyTree {
  id: number;
  name: string;
  roots: TagTree[];
}

export interface TagTree {
  id: number;
  name: string;
  children: TagTree[];
}
