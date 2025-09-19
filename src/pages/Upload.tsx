import React from 'react';
import { Typography } from 'antd';
import FileUpload from '../components/Upload/FileUpload';

const { Title } = Typography;

const Upload: React.FC = () => {
  return (
    <div>
      <Title level={2}>Upload File</Title>
      <FileUpload />
    </div>
  );
};

export default Upload;