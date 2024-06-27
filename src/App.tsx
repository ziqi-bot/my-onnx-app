

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import VideoUpload from './VideoUpload';
import Results from './Results';
import YOLO from './YOLO';
import Search from './Search';
import SearchResults from './SearchResults';

export interface ProcessCompleteParams {
  videoUrl: string;
}

const App: React.FC = () => {
  const classNames = ["pedestrian", "biker", "skater", "cart", "car", "bus"];
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [averageCounts, setAverageCounts] = useState<number[]>(Array(classNames.length).fill(0));
  const [frameCounts, setFrameCounts] = useState<number[][]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [searchMode, setSearchMode] = useState<'latest' | 'all'>('latest');

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleProcessComplete = ({ videoUrl }: ProcessCompleteParams) => {
    console.log('Video processing completed');
    setVideoFile(null); // Clear video file after processing

    // Calculate average counts using a new variable
    if (frameCounts.length > 0) {
      const totalCounts = Array(classNames.length).fill(0);
      frameCounts.forEach(counts => {
        counts.forEach((count, index) => {
          totalCounts[index] += count;
        });
      });

      const averageCounts = totalCounts.map(count => Math.ceil(count / frameCounts.length)); // Round up
      console.log('Average Counts:', averageCounts);
      setAverageCounts(averageCounts);

      // Upload detection results to the backend
      const formData = new FormData();
      formData.append('averageCounts', JSON.stringify(averageCounts));
      fetch(`${process.env.REACT_APP_API_URL}saveResults`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response from server:', data);
        })
        .catch(error => {
          console.error('Error uploading data:', error);
        });

      // 清空中间变量
      setFrameCounts([]);
      setCurrentFrame(0);
    }
  };

  const handleFrameProcessed = (counts: number[], frameNumber: number) => {
    setFrameCounts(prev => {
      const updatedFrameCounts = [...prev, counts];

      // Update average counts in real-time
      if (updatedFrameCounts.length > 0) {
        const totalCounts = Array(classNames.length).fill(0);
        updatedFrameCounts.forEach(counts => {
          counts.forEach((count, index) => {
            totalCounts[index] += count;
          });
        });

        const averageCounts = totalCounts.map(count => Math.ceil(count / updatedFrameCounts.length)); // Round up
        setAverageCounts(averageCounts);
      }

      return updatedFrameCounts;
    });

    setCurrentFrame(frameNumber);
  };

  const handleSearchResults = (results: any[], mode: 'latest' | 'all') => {
    setSearchResults(results);
    setSearchMode(mode);
  };

  return (
    <Box sx={{ fontFamily: 'Roboto', padding: '20px' }}>
      <Box className="search-bar" sx={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Search Detection Results
        </Typography>
        <Search onSearchResults={handleSearchResults} />
      </Box>

      <Box className="data-grid" sx={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Search Results
        </Typography>
        <SearchResults searchResults={searchResults} mode={searchMode} />
      </Box>

      <Box className="upload-section" sx={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Upload Video
        </Typography>
        <VideoUpload onVideoUpload={handleVideoUpload} />
      </Box>

      {videoFile && (
        <YOLO videoFile={videoFile} onProcessComplete={handleProcessComplete} onFrameProcessed={handleFrameProcessed} />
      )}

      <Results
        averageCounts={averageCounts}
        frameCounts={frameCounts[frameCounts.length - 1] || []}
        classNames={classNames}
        loading={false}
        currentFrame={currentFrame}
      />
    </Box>
  );
};

export default App;










