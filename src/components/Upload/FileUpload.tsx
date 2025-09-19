import React, { useState } from 'react';
import { Upload, Button, message, Card, List, Progress, Space } from 'antd';
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { minioClient } from '../../services/minio';

const { Dragger } = Upload;

interface FileUploadProps {
  maxCount?: number;
  accept?: string;
  bucketName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  maxCount = 5, 
  accept = '*',
  bucketName = 'uploads' 
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept,
    maxCount,
    fileList,
    customRequest: async ({ file, onProgress, onSuccess, onError }) => {
      try {
        setUploading(true);
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 100) {
            progress = 100;
            clearInterval(interval);
          }
          onProgress?.({ percent: progress });
        }, 500);

        // Upload to MinIO (simulated)
        const uploadFile = file as File;
        const objectName = `${Date.now()}-${uploadFile.name}`;
        const url = await minioClient.uploadFile(bucketName, objectName, uploadFile);
        
        clearInterval(interval);
        onProgress?.({ percent: 100 });
        onSuccess?.(url);
        
        message.success(`${uploadFile.name} upload thành công!`);
      } catch (error: any) {
        onError?.(error);
        message.error(`${(file as File).name} upload thất bại: ${error.message}`);
      } finally {
        setUploading(false);
      }
    },
    onChange(info) {
      setFileList(info.fileList);
      
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!');
        return false;
      }
      return true;
    },
  };

  const handleRemove = async (file: UploadFile) => {
    try {
      if (file.response) {
        // Extract object name from URL for deletion
        const objectName = file.response.split('/').pop();
        await minioClient.deleteFile(bucketName, objectName);
      }
      message.success('Xóa file thành công');
    } catch (error) {
      message.error('Không thể xóa file');
    }
  };

  const clearAll = () => {
    setFileList([]);
    message.info('Đã xóa tất cả file');
  };

  return (
    <div>
      <Card title="Upload File" style={{ marginBottom: 16 }}>
        <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click hoặc kéo thả file vào đây để upload</p>
          <p className="ant-upload-hint">
            Hỗ trợ upload đơn lẻ hoặc nhiều file. Tối đa {maxCount} file, mỗi file không quá 10MB.
          </p>
        </Dragger>

        <Space>
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={fileList.length === 0}
          >
            {uploading ? 'Đang upload...' : 'Upload Selected'}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={clearAll}
            disabled={fileList.length === 0}
          >
            Xóa tất cả
          </Button>
        </Space>
      </Card>

      {fileList.length > 0 && (
        <Card title="Danh sách file">
          <List
            itemLayout="horizontal"
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    danger 
                    size="small"
                    onClick={() => handleRemove(item)}
                  >
                    Xóa
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <div>
                      <div>Trạng thái: {
                        item.status === 'done' ? 'Hoàn thành' : 
                        item.status === 'uploading' ? 'Đang upload' : 
                        item.status === 'error' ? 'Lỗi' : 'Chờ upload'
                      }</div>
                      {item.status === 'uploading' && item.percent && (
                        <Progress percent={Math.round(item.percent)} size="small" />
                      )}
                      {item.status === 'done' && item.response && (
                        <div>URL: <a href={item.response} target="_blank" rel="noopener noreferrer">
                          {item.response}
                        </a></div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default FileUpload;