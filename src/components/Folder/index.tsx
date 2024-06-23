import React from 'react';
import File from '../File';
import { FileNode, FolderNode } from '../../types';


interface FolderState {
  collapsed: boolean;
}

class Folder extends React.Component<FolderNode, FolderState> {
  constructor(props: FolderNode) {
    super(props);
    this.state = {
      collapsed: !this.props.expandedFolders.includes(this.props.path),
    };
  }

  componentDidUpdate(prevProps: FolderNode) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.forceUpdate();
    }
  }

  toggleCollapse = () => {
    this.setState((state) => ({ collapsed: !state.collapsed }));
  };

  renderChildren() {
    const { children, expandedFolders, searchQuery, path } = this.props;
    const { collapsed } = this.state;

    const filteredChildren = children.filter((child) => {
      if ('mime' in child) {
        return !searchQuery || child.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return (
          child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          child.children.some((grandchild) =>
            'mime' in grandchild
              ? grandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
              : grandchild.children.some((greatGrandchild) =>
                'mime' in greatGrandchild
                  ? greatGrandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
                  : false
              )
          )
        );
      }
    });

    if (collapsed && !searchQuery) {
      return null;
    }

    return (
      <div style={{ paddingLeft: '20px' }}>
        {filteredChildren.map((child, index) => {
          if ('mime' in child) {
            return <File key={index} {...child} />;
          } else {
            return (
              <Folder
                key={index}
                {...child}
                path={`${path}/${child.name}`}
                expandedFolders={expandedFolders}
                searchQuery={searchQuery}
              />
            );
          }
        })}
      </div>
    );
  }

  render() {
    const { name, searchQuery, children } = this.props;

    const hasMatchingChild = children.some((child) =>
      'mime' in child
        ? child.name.toLowerCase().includes(searchQuery.toLowerCase())
        : child.children.some((grandchild: FileNode | FolderNode) =>
          'mime' in grandchild
            ? grandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
            : grandchild.children.some((greatGrandchild: FileNode | FolderNode) =>
              'mime' in greatGrandchild
                ? greatGrandchild.name.toLowerCase().includes(searchQuery.toLowerCase())
                : false
            )
        )
    );

    if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase()) && !hasMatchingChild) {
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
