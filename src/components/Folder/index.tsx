import { Component } from 'react';
import File from '../File';
import { FileNode, FolderNode } from '../../types';

interface FolderProps extends FolderNode {}

interface FolderState {
  collapsed: boolean;
}

class Folder extends Component<FolderProps, FolderState> {
  constructor(props: FolderProps) {
    super(props);
    this.state = {
      collapsed: !props.expandedFolders.includes(props.path),
    };
  }
  componentDidUpdate(prevProps: FolderProps) {
    const expandedFoldersChanged = prevProps.expandedFolders !== this.props.expandedFolders;
    const pathChanged = prevProps.path !== this.props.path;

    if (expandedFoldersChanged || pathChanged) {
      this.setState({ collapsed: !this.props.expandedFolders.includes(this.props.path) });
    }
  }

  toggleCollapse = () => {
    this.setState((state) => ({ collapsed: !state.collapsed }));
  };

  filterChildren(children: (FileNode | FolderNode)[], searchQuery: string): (FileNode | FolderNode)[] {
    return children.filter((child) => {
      if ('mime' in child) {
        return !searchQuery || child.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return (
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        this.filterChildren(child.children, searchQuery).length > 0
      );
    });
  }

  hasMatchingChild(children: (FileNode | FolderNode)[], searchQuery: string): boolean {
    return children.some((child) => {
      if ('mime' in child) {
        return child.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return (
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        this.hasMatchingChild(child.children, searchQuery)
      );
    });
  }

  renderChildren() {
    const { children, expandedFolders, searchQuery, path } = this.props;
    const { collapsed } = this.state;

    if (collapsed && !searchQuery) {
      return null;
    }

    const filteredChildren = this.filterChildren(children, searchQuery);

    return (
      <div style={{ paddingLeft: '20px' }}>
        {filteredChildren.map((child, index) => (
          'mime' in child ? (
            <File key={index} {...child} />
          ) : (
            <Folder
              key={index}
              {...child}
              path={`${path}/${child.name}`}
              expandedFolders={expandedFolders}
              searchQuery={searchQuery}
            />
          )
        ))}
      </div>
    );
  }

  render() {
    const { name, searchQuery, children } = this.props;

    const doesNotMatchSearchQuery = searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase());
    const hasNoMatchingChild = !this.hasMatchingChild(children, searchQuery);

    if (doesNotMatchSearchQuery && hasNoMatchingChild) {
      return null;
    }

    return (
      <div>
        <div onClick={this.toggleCollapse} style={{ cursor: 'pointer' }}>
          📁 {name}
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

export default Folder;
