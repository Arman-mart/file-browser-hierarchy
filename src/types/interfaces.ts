export interface FileNode {
    name: string;
    mime: string;
  }
  
  export interface FolderNode {
    name: string;
    children: Array<FileNode | FolderNode>;
    path: string;
    expandedFolders: string[];
    searchQuery: string;
  }
  
  export interface FileExplorerState {
    data: Array<FolderNode>;
    loading: boolean;
    searchQuery: string;
  }
  