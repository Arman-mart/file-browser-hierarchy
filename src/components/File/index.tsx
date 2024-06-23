import React from 'react';

interface FileProps {
  name: string;
  mime: string;
}

class File extends React.Component<FileProps> {
  render() {
    return (
      <div style={{ paddingLeft: '20px' }}>
         {this.props.name} ({this.props.mime})
      </div>
    );
  }
}

export default File;
