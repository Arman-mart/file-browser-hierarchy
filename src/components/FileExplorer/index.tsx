import { Component, ChangeEvent } from 'react';
import Folder from '../Folder';
import { FileExplorerState, FolderNode } from '../../types';

interface FileExplorerProps {
  expandedFolders: string[];
}

class FileExplorer extends Component<FileExplorerProps, FileExplorerState> {
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
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const response = await fetch(`/data.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: FolderNode[] = await response.json();
      this.setState({ data, loading: false });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false, error: error.message });
    }
  };

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  renderLoading = () => <div>Loading...</div>;

  renderError = () => (
    <div>
      <p>Error fetching data: {this.state.error}</p>
    </div>
  );

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
  } else if (error) {
      return this.renderError();
  } else {
    return this.renderData();
  }
}

}

export default FileExplorer;
