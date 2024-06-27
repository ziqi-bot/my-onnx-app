import React, { useState } from 'react';
import { Button, Input } from '@mui/material';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onVideoUpload(selectedFile);
      setSelectedFile(null); // 清空选择的文件
      (document.getElementById('fileInput') as HTMLInputElement).value = ''; // 清空文件输入控件的值
    }
  };

  return (
    <div>
      <Input id="fileInput" type="file" inputProps={{ accept: 'video/*' }} onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUploadClick} disabled={!selectedFile}>
        Upload Video
      </Button>
    </div>
  );
};

export default VideoUpload;
