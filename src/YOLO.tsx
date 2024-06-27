

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { InferenceSession, Tensor, env } from 'onnxruntime-web';
// import cv from "@techstark/opencv-js";
// import './YOLO.css';

// const classNames = [
//   "pedestrian",
//   "biker",
//   "skater",
//   "cart",
//   "car",
//   "bus"
// ];

// const COLORS = [
//   [0.000, 0.447, 0.741], [0.850, 0.325, 0.098], [0.929, 0.694, 0.125], [0.494, 0.184, 0.556],
//   [0.466, 0.674, 0.188], [0.301, 0.745, 0.933], [0.635, 0.078, 0.184], [0.300, 0.300, 0.300],
//   [0.600, 0.600, 0.600], [1.000, 0.000, 0.000], [1.000, 0.500, 0.000], [0.749, 0.749, 0.000],
//   [0.000, 1.000, 0.000], [0.000, 0.000, 1.000], [0.667, 0.000, 1.000], [0.333, 0.333, 0.000],
//   [0.333, 0.667, 0.000], [0.333, 1.000, 0.000], [0.667, 0.333, 0.000], [0.667, 0.667, 0.000],
//   [0.667, 1.000, 0.000], [1.000, 0.333, 0.000], [1.000, 0.667, 0.000], [1.000, 1.000, 0.000],
//   [0.333, 0.500, 0.000], [0.667, 0.500, 0.000], [1.000, 0.500, 0.000], [0.500, 0.333, 0.000],
//   [0.500, 0.667, 0.000], [0.500, 1.000, 0.000], [0.333, 0.333, 0.333], [0.500, 0.500, 0.500],
//   [0.667, 0.667, 0.667], [0.833, 0.833, 0.833], [1.000, 1.000, 1.000]
// ];

// interface YOLOProps {
//   videoFile: File;
//   onProcessComplete: (params: ProcessCompleteParams) => void;
//   onFrameProcessed: (frameCounts: number[], frameNumber: number) => void;
// }

// interface ProcessCompleteParams {
//   videoUrl: string;
//   averageCounts: number[];
// }

// const YOLO: React.FC<YOLOProps> = ({ videoFile, onProcessComplete, onFrameProcessed }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [session, setSession] = useState<InferenceSession | null>(null);
//   const [frameNumber, setFrameNumber] = useState(0);
//   const [totalCounts, setTotalCounts] = useState<number[]>(Array(classNames.length).fill(0));
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     const checkOpenCVLoaded = () => {
//       if (window.cv && window.cv.Mat) {
//         loadModel();
//       } else {
//         setTimeout(checkOpenCVLoaded, 100);
//       }
//     };

//     checkOpenCVLoaded();
//   }, []);

//   const loadModel = async () => {
//     console.log("Loading model...");
//     try {
//       env.wasm.numThreads = 4;
//       const session = await InferenceSession.create('./yolov4-tiny-obj.onnx');
//       console.log("Model loaded successfully.");
//       setSession(session);
//     } catch (error) {
//       console.error("Error loading model:", error);
//     }
//   };

//   const preprocess = (frame: cv.Mat) => {
//     const inputSize = new cv.Size(416, 416);
//     const resized = new cv.Mat();
//     cv.resize(frame, resized, inputSize, 0, 0, cv.INTER_LINEAR);

//     const matC3 = new cv.Mat();
//     cv.cvtColor(resized, matC3, cv.COLOR_RGBA2RGB);

//     const inputBlob = cv.blobFromImage(matC3, 1 / 255.0, inputSize, new cv.Scalar(0, 0, 0), true, false);
//     resized.delete();
//     matC3.delete();
//     return inputBlob;
//   };

//   const getDetections = useCallback((output: Tensor, scoreThreshold: number, imageWidth: number, imageHeight: number): [number[][], number[], number[], number[]] => {
//     const predictions = output.data as Float32Array;
//     const numDetections = predictions.length / 10;
//     const boxes: number[][] = [];
//     const scores: number[] = [];
//     const classIndices: number[] = [];
//     const frameCounts = Array(classNames.length).fill(0);

//     for (let i = 0; i < numDetections; i++) {
//       const offset = i * 10;
//       const [x1, y1, x2, y2, ...clsScores] = Array.from(predictions.slice(offset, offset + 10));
//       const maxClsScore = Math.max(...clsScores);
//       const score = maxClsScore;

//       if (score > scoreThreshold) {
//         const xMin = x1 * imageWidth;
//         const yMin = y1 * imageHeight;
//         const xMax = x2 * imageWidth;
//         const yMax = y2 * imageHeight;

//         boxes.push([xMin, yMin, xMax, yMax]);
//         scores.push(score);
//         const classIndex = clsScores.indexOf(maxClsScore);
//         classIndices.push(classIndex);
//         frameCounts[classIndex] += 1;
//       }
//     }

//     onFrameProcessed(frameCounts, frameNumber);
//     return [boxes, scores, classIndices, frameCounts];
//   }, [frameNumber, onFrameProcessed]);

//   const processVideo = useCallback(async (videoElement: HTMLVideoElement) => {
//     if (!session) {
//       console.error("Session is not defined.");
//       return;
//     }

//     console.log("Processing video...");
//     setIsProcessing(true);
//     await videoElement.play();

//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');

//     if (canvas && ctx) {
//       canvas.width = videoElement.videoWidth;
//       canvas.height = videoElement.videoHeight;

//       const detectFrame = async () => {
//         if (videoElement.paused || videoElement.ended) {
//           const averageCounts = totalCounts.map(count => count / frameNumber);
//           console.log(averageCounts);
//           const videoBlob = new Blob([canvas.toDataURL('image/png')], { type: 'video/mp4' });
//           const videoUrl = URL.createObjectURL(videoBlob);

//           onProcessComplete({
//             videoUrl: videoUrl,
//             averageCounts
//           });

//           setTimeout(() => {
//             setIsProcessing(false);
//           }, 5000); // Wait for 5 seconds before setting isProcessing to false
//           return;
//         }

//         ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//         const mat = cv.matFromImageData(imageData);
//         const input = preprocess(mat);
//         mat.delete();

//         const tensor = new Tensor('float32', input.data32F, [1, 3, 416, 416]);
//         const feeds = { input: tensor };

//         try {
//           const output = await session.run(feeds);
//           const [boxes, scores, classIndices, frameCounts] = getDetections(output['output'], 0.3, canvas.width, canvas.height);

//           if (boxes.length > 0) {
//             drawBoxes(ctx, boxes, scores, classIndices);
//           }

//           setTotalCounts(prev => prev.map((count, index) => count + frameCounts[index]));
//           setFrameNumber(prev => prev + 1);

//           requestAnimationFrame(detectFrame);
//         } catch (error) {
//           console.error("Error during inference:", error);
//         }
//       };

//       detectFrame(); // Start processing frames
//     }
//   }, [session, onProcessComplete, getDetections, totalCounts, frameNumber]);

//   useEffect(() => {
//     if (videoFile && !isProcessing) {
//       const videoElement = document.createElement('video');
//       videoElement.src = URL.createObjectURL(videoFile);

//       videoElement.onloadedmetadata = () => {
//         processVideo(videoElement);
//       };

//       videoElement.onerror = () => {
//         console.error("Error loading video metadata.");
//       };
//     }
//   }, [videoFile, session, processVideo, isProcessing]);

//   const drawBoxes = (ctx: CanvasRenderingContext2D, boxes: number[][], scores: number[], classIndices: number[]) => {
//     boxes.forEach((box, i) => {
//       const [x0, y0, x1, y1] = box;
//       const color = COLORS[classIndices[i]];

//       const r = Math.min(color[0] * 255 + 50, 255);
//       const g = Math.min(color[1] * 255 + 50, 255);
//       const b = Math.min(color[2] * 255 + 50, 255);

//       ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
//       ctx.lineWidth = 4;

//       ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

//       const text = `${classNames[classIndices[i]]}: ${scores[i].toFixed(1)}`;
//       ctx.font = "16px Arial";
//       ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
//       ctx.fillRect(x0, y0 - 25, x1 - x0, 25);
//       ctx.fillStyle = "rgb(0, 0, 0)";
//       ctx.fillText(text, x0, y0 - 5);
//     });
//   };

//   return (
//     <div className="video-container">
//       <canvas ref={canvasRef}></canvas>
//     </div>
//   );
// };

// export default YOLO;


























import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InferenceSession, Tensor, env } from 'onnxruntime-web';
import cv from "@techstark/opencv-js";
import './YOLO.css';

const classNames = [
  "pedestrian",
  "biker",
  "skater",
  "cart",
  "car",
  "bus"
];

const COLORS = [
  [0.000, 0.447, 0.741], [0.850, 0.325, 0.098], [0.929, 0.694, 0.125], [0.494, 0.184, 0.556],
  [0.466, 0.674, 0.188], [0.301, 0.745, 0.933], [0.635, 0.078, 0.184], [0.300, 0.300, 0.300],
  [0.600, 0.600, 0.600], [1.000, 0.000, 0.000], [1.000, 0.500, 0.000], [0.749, 0.749, 0.000],
  [0.000, 1.000, 0.000], [0.000, 0.000, 1.000], [0.667, 0.000, 1.000], [0.333, 0.333, 0.000],
  [0.333, 0.667, 0.000], [0.333, 1.000, 0.000], [0.667, 0.333, 0.000], [0.667, 0.667, 0.000],
  [0.667, 1.000, 0.000], [1.000, 0.333, 0.000], [1.000, 0.667, 0.000], [1.000, 1.000, 0.000],
  [0.333, 0.500, 0.000], [0.667, 0.500, 0.000], [1.000, 0.500, 0.000], [0.500, 0.333, 0.000],
  [0.500, 0.667, 0.000], [0.500, 1.000, 0.000], [0.333, 0.333, 0.333], [0.500, 0.500, 0.500],
  [0.667, 0.667, 0.667], [0.833, 0.833, 0.833], [1.000, 1.000, 1.000]
];

interface YOLOProps {
  videoFile: File;
  onProcessComplete: (params: ProcessCompleteParams) => void;
  onFrameProcessed: (frameCounts: number[], frameNumber: number) => void;
}

interface ProcessCompleteParams {
  videoUrl: string;
}

const YOLO: React.FC<YOLOProps> = ({ videoFile, onProcessComplete, onFrameProcessed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [session, setSession] = useState<InferenceSession | null>(null);
  const [frameNumber, setFrameNumber] = useState(0);
  const [allFrameCounts, setAllFrameCounts] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkOpenCVLoaded = () => {
      if (window.cv && window.cv.Mat) {
        loadModel();
      } else {
        setTimeout(checkOpenCVLoaded, 100);
      }
    };

    checkOpenCVLoaded();
  }, []);

  const loadModel = async () => {
    console.log("Loading model...");
    try {
      env.wasm.numThreads = 1; // Disable multi-threading for now
      const session = await InferenceSession.create('./yolov4-tiny-obj.onnx');
      console.log("Model loaded successfully.");
      setSession(session);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  const preprocess = (frame: cv.Mat) => {
    const inputSize = new cv.Size(416, 416);
    const resized = new cv.Mat();
    cv.resize(frame, resized, inputSize, 0, 0, cv.INTER_LINEAR);

    const matC3 = new cv.Mat();
    cv.cvtColor(resized, matC3, cv.COLOR_RGBA2RGB);

    const inputBlob = cv.blobFromImage(matC3, 1 / 255.0, inputSize, new cv.Scalar(0, 0, 0), true, false);
    resized.delete();
    matC3.delete();
    return inputBlob;
  };

  const getDetections = useCallback((output: Tensor, scoreThreshold: number, imageWidth: number, imageHeight: number): [number[][], number[], number[], number[]] => {
    const predictions = output.data as Float32Array;
    const numDetections = predictions.length / 10;
    const boxes: number[][] = [];
    const scores: number[] = [];
    const classIndices: number[] = [];
    const frameCounts = Array(classNames.length).fill(0);

    for (let i = 0; i < numDetections; i++) {
      const offset = i * 10;
      const [x1, y1, x2, y2, ...clsScores] = Array.from(predictions.slice(offset, offset + 10));
      const maxClsScore = Math.max(...clsScores);
      const score = maxClsScore;

      if (score > scoreThreshold) {
        const xMin = x1 * imageWidth;
        const yMin = y1 * imageHeight;
        const xMax = x2 * imageWidth;
        const yMax = y2 * imageHeight;

        boxes.push([xMin, yMin, xMax, yMax]);
        scores.push(score);
        const classIndex = clsScores.indexOf(maxClsScore);
        classIndices.push(classIndex);
        frameCounts[classIndex] += 1;
      }
    }

    onFrameProcessed(frameCounts, frameNumber);
    return [boxes, scores, classIndices, frameCounts];
  }, [frameNumber, onFrameProcessed]);

  const processVideo = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!session) {
      console.error("Session is not defined.");
      return;
    }

    console.log("Processing video...");
    setIsProcessing(true);
    setFrameNumber(0);
    setAllFrameCounts([]);
    
    await videoElement.play();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    if (canvas && ctx) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const detectFrame = async () => {
        if (videoElement.paused || videoElement.ended) {
          const videoBlob = new Blob([canvas.toDataURL('image/png')], { type: 'video/mp4' });
          const videoUrl = URL.createObjectURL(videoBlob);

          onProcessComplete({
            videoUrl: videoUrl
          });

          setTimeout(() => {
            setIsProcessing(false);
          }, 5000); // Wait for 5 seconds before setting isProcessing to false
          return;
        }

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const mat = cv.matFromImageData(imageData);
        const input = preprocess(mat);
        mat.delete();

        const tensor = new Tensor('float32', input.data32F, [1, 3, 416, 416]);
        const feeds = { input: tensor };

        try {
          const output = await session.run(feeds);
          const [boxes, scores, classIndices, frameCounts] = getDetections(output['output'], 0.3, canvas.width, canvas.height);

          if (boxes.length > 0) {
            drawBoxes(ctx, boxes, scores, classIndices);
          }

          setAllFrameCounts(prev => [...prev, frameCounts]);
          setFrameNumber(prev => prev + 1);

          requestAnimationFrame(detectFrame);
        } catch (error) {
          console.error("Error during inference:", error);
        }
      };

      detectFrame(); // Start processing frames
    }
  }, [session, onProcessComplete, getDetections]);

  useEffect(() => {
    if (videoFile && !isProcessing) {
      if (session) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(videoFile);

        videoElement.onloadedmetadata = () => {
          processVideo(videoElement);
        };

        videoElement.onerror = () => {
          console.error("Error loading video metadata.");
        };
      } else {
        console.error("Session is not available. Delaying video processing...");
      }
    }
  }, [videoFile, session, processVideo, isProcessing]);

  const drawBoxes = (ctx: CanvasRenderingContext2D, boxes: number[][], scores: number[], classIndices: number[]) => {
    boxes.forEach((box, i) => {
      const [x0, y0, x1, y1] = box;
      const color = COLORS[classIndices[i]];

      const r = Math.min(color[0] * 255 + 50, 255);
      const g = Math.min(color[1] * 255 + 50, 255);
      const b = Math.min(color[2] * 255 + 50, 255);

      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.lineWidth = 4;

      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

      const text = `${classNames[classIndices[i]]}: ${scores[i].toFixed(1)}`;
      ctx.font = "16px Arial";
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
      ctx.fillRect(x0, y0 - 25, x1 - x0, 25);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(text, x0, y0 - 5);
    });
  };

  return (
    <div className="video-container">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default YOLO;
