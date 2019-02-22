
export interface TagHierarchyTree {
  id: number;
  name: string;
  roots: TagTreeNode[];
}

export interface TagTreeNode {
  id: number;
  name: string;
  children: TagTreeNode[];
}
