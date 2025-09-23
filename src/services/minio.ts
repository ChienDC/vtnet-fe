// MinIO service for file upload
export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

// Giả lập MinIO client vì không thể import trực tiếp trong browser
export class MinioService {
  private config: MinioConfig;

  constructor(config: MinioConfig) {
    this.config = config;
  }

  // Giả lập upload file
  async uploadFile(bucketName: string, objectName: string, file: File): Promise<string> {
    // Trong thực tế, bạn sẽ cần một backend API để handle việc upload
    // Đây chỉ là simulation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          reject(new Error('File quá lớn'));
        } else {
          // Giả lập URL của file đã upload
          const fakeUrl = `https://minio.example.com/${bucketName}/${objectName}`;
          resolve(fakeUrl);
        }
      }, 2000);
    });
  }

  // Giả lập delete file
  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Đã xóa file: ${bucketName}/${objectName}`);
        resolve();
      }, 1000);
    });
  }
}

// Default MinIO instance (thay thế với config thực tế của bạn)
export const minioClient = new MinioService({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'minio123',
});