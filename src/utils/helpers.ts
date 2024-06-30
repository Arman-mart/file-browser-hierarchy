import { FileNode, FolderNode } from '../types';

export function filterChildren(children: (FileNode | FolderNode)[], searchQuery: string): (FileNode | FolderNode)[] {
  return children.filter((child) => {
    if ('mime' in child) {
      return !searchQuery || child.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return (
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      filterChildren(child.children, searchQuery).length > 0
    );
  });
}

export function hasMatchingChild(children: (FileNode | FolderNode)[], searchQuery: string): boolean {
  return children.some((child) => {
    if ('mime' in child) {
      return child.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return (
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hasMatchingChild(child.children, searchQuery)
    );
  });
}