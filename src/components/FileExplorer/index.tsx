import React from 'react';
import Folder from '../Folder';
import { FileExplorerState } from '../../types';

interface FileExplorerProps {
  expandedFolders: string[];
}

class FileExplorer extends React.Component<FileExplorerProps, FileExplorerState> {
  constructor(props: FileExplorerProps) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      searchQuery: '',
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/data.json`)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }))
      .catch((error) => console.error('Error fetching data:', error));
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    const { data, loading, searchQuery } = this.state;
    const { expandedFolders } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <input
          type="text"
          placeholder="Search files"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />
        {data.map((folder, index) => (
          <Folder
            key={index}
            {...folder}
            path={`/${folder.name}`}
            expandedFolders={expandedFolders}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    );
  }
}

export default FileExplorer;
