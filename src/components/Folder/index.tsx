import { Component } from 'react';
import File from '../File';
import { FolderNode, FileNode } from '../../types';
import { filterChildren, hasMatchingChild } from '../../utils';

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

  renderChildren() {
    const { children, expandedFolders, searchQuery, path } = this.props;
    const { collapsed } = this.state;

    if (collapsed && !searchQuery) {
      return null;
    }

    const filteredChildren = filterChildren(children, searchQuery);

    return (
      <div style={{ paddingLeft: '20px' }}>
        {filteredChildren.map((child: FileNode | FolderNode, index: number) => (
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
    const hasNoMatchingChild = !hasMatchingChild(children, searchQuery);

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
