import { Component } from "react";
import { FileNode } from "../../types";

interface FileProps extends FileNode {}

class File extends Component<FileProps> {
  render() {
    return (
      <div style={{ paddingLeft: '20px' }}>
         {this.props.name} ({this.props.mime})
      </div>
    );
  }
}

export default File;
