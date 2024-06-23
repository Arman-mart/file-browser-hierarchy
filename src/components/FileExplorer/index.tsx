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
      error: '',
    };
  }

  componentDidMount() {
    fetch(`/data.json`)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }))
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false, error: error.message });
      });
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  renderLoading = () => {
    return <div>Loading...</div>;
  };

  renderError = () => {
    return (
      <div>
        <p>Error fetching data: {this.state.error}</p>
      </div>
    );
  };

  renderData = () => {
    const { data, searchQuery } = this.state;
    const { expandedFolders } = this.props;

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
  };

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError();
    }

    return this.renderData();
  }
}


export default FileExplorer;
