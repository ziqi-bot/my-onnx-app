import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface ResultsProps {
  averageCounts: number[];
  classNames: string[];
  loading: boolean;
  frameCounts: number[];
  currentFrame: number;
}

const Results: React.FC<ResultsProps> = ({ averageCounts, classNames, loading, frameCounts, currentFrame }) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const pedestrianIndex = classNames.indexOf("pedestrian");
    const bikerIndex = classNames.indexOf("biker");

    let message = null;
    if (frameCounts[pedestrianIndex] > 20 || frameCounts[bikerIndex] > 10) {
      message = "High crowd density!";
    }

    if (message) {
      setAlertMessage(message);
      // Set a timeout to clear the alert after 5 seconds
      const timeout = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timeout); // Clear the timeout if the component unmounts or the effect re-runs
    }
  }, [frameCounts, classNames, currentFrame]);

  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage(null);
      }, 800);
      return () => clearTimeout(timeout); // Clear the timeout if the component unmounts or the effect re-runs
    }
  }, [alertMessage]);

  return (
    <Box sx={{ position: 'relative', padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '20px' }}>
      {alertMessage && (
        <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '4px' }}>
          <Typography variant="h6">Alert:</Typography>
          <Typography variant="body1">{alertMessage}</Typography>
        </div>
      )}
      <Typography variant="h5" gutterBottom>
        Real-Time Detections
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Typography variant="h6" gutterBottom>
            
          </Typography>
          <ul>
            {classNames.map((name, index) => (
              <li key={index}>{name}: {frameCounts[index]}</li>
            ))}
          </ul>
          
        </div>
      )}
    </Box>
  );
};

export default Results;
