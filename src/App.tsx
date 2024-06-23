import React from 'react';
import FileExplorer from './components/FileExplorer';
import { EXPANDED_FOLDERS } from './utils/constants';

class App extends React.Component {
  render() {
    return (
      <div>
        <FileExplorer expandedFolders={EXPANDED_FOLDERS} />
      </div>
    );
  }
}

export default App;
