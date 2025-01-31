import { bool, double, InputArray, InputOutputArray, int, Mat, OutputArray, OutputArrayOfArrays, RotatedRect, Size, TermCriteria } from "./_types";
/**
 * number of levels in constructed pyramid. Can be less than maxLevel.
 *
 * @param img 8-bit input image.
 *
 * @param pyramid output pyramid.
 *
 * @param winSize window size of optical flow algorithm. Must be not less than winSize argument of
 * calcOpticalFlowPyrLK. It is needed to calculate required padding for pyramid levels.
 *
 * @param maxLevel 0-based maximal pyramid level number.
 *
 * @param withDerivatives set to precompute gradients for the every pyramid level. If pyramid is
 * constructed without the gradients then calcOpticalFlowPyrLK will calculate them internally.
 *
 * @param pyrBorder the border mode for pyramid layers.
 *
 * @param derivBorder the border mode for gradients.
 *
 * @param tryReuseInputImage put ROI of input image into the pyramid if possible. You can pass false to
 * force data copying.
 */
export declare function buildOpticalFlowPyramid(img: InputArray, pyramid: OutputArrayOfArrays, winSize: Size, maxLevel: int, withDerivatives?: bool, pyrBorder?: int, derivBorder?: int, tryReuseInputImage?: bool): int;
/**
 * The function finds an optical flow for each prev pixel using the Farneback2003 algorithm so that
 *
 * `\\[\\texttt{prev} (y,x) \\sim \\texttt{next} ( y + \\texttt{flow} (y,x)[1], x + \\texttt{flow}
 * (y,x)[0])\\]`
 *
 * An example using the optical flow algorithm described by Gunnar Farneback can be found at
 * opencv_source_code/samples/cpp/fback.cpp
 * (Python) An example using the optical flow algorithm described by Gunnar Farneback can be found at
 * opencv_source_code/samples/python/opt_flow.py
 *
 * @param prev first 8-bit single-channel input image.
 *
 * @param next second input image of the same size and the same type as prev.
 *
 * @param flow computed flow image that has the same size as prev and type CV_32FC2.
 *
 * @param pyr_scale parameter, specifying the image scale (<1) to build pyramids for each image;
 * pyr_scale=0.5 means a classical pyramid, where each next layer is twice smaller than the previous
 * one.
 *
 * @param levels number of pyramid layers including the initial image; levels=1 means that no extra
 * layers are created and only the original images are used.
 *
 * @param winsize averaging window size; larger values increase the algorithm robustness to image noise
 * and give more chances for fast motion detection, but yield more blurred motion field.
 *
 * @param iterations number of iterations the algorithm does at each pyramid level.
 *
 * @param poly_n size of the pixel neighborhood used to find polynomial expansion in each pixel; larger
 * values mean that the image will be approximated with smoother surfaces, yielding more robust
 * algorithm and more blurred motion field, typically poly_n =5 or 7.
 *
 * @param poly_sigma standard deviation of the Gaussian that is used to smooth derivatives used as a
 * basis for the polynomial expansion; for poly_n=5, you can set poly_sigma=1.1, for poly_n=7, a good
 * value would be poly_sigma=1.5.
 *
 * @param flags operation flags that can be a combination of the following:
 * OPTFLOW_USE_INITIAL_FLOW uses the input flow as an initial flow
 * approximation.OPTFLOW_FARNEBACK_GAUSSIAN uses the Gaussian $\texttt{winsize}\times\texttt{winsize}$
 * filter instead of a box filter of the same size for optical flow estimation; usually, this option
 * gives z more accurate flow than with a box filter, at the cost of lower speed; normally, winsize for
 * a Gaussian window should be set to a larger value to achieve the same level of robustness.
 */
export declare function calcOpticalFlowFarneback(prev: InputArray, next: InputArray, flow: InputOutputArray, pyr_scale: double, levels: int, winsize: int, iterations: int, poly_n: int, poly_sigma: double, flags: int): void;
/**
 * The function implements a sparse iterative version of the Lucas-Kanade optical flow in pyramids. See
 * Bouguet00 . The function is parallelized with the TBB library.
 *
 * An example using the Lucas-Kanade optical flow algorithm can be found at
 * opencv_source_code/samples/cpp/lkdemo.cpp
 * (Python) An example using the Lucas-Kanade optical flow algorithm can be found at
 * opencv_source_code/samples/python/lk_track.py
 * (Python) An example using the Lucas-Kanade tracker for homography matching can be found at
 * opencv_source_code/samples/python/lk_homography.py
 *
 * @param prevImg first 8-bit input image or pyramid constructed by buildOpticalFlowPyramid.
 *
 * @param nextImg second input image or pyramid of the same size and the same type as prevImg.
 *
 * @param prevPts vector of 2D points for which the flow needs to be found; point coordinates must be
 * single-precision floating-point numbers.
 *
 * @param nextPts output vector of 2D points (with single-precision floating-point coordinates)
 * containing the calculated new positions of input features in the second image; when
 * OPTFLOW_USE_INITIAL_FLOW flag is passed, the vector must have the same size as in the input.
 *
 * @param status output status vector (of unsigned chars); each element of the vector is set to 1 if
 * the flow for the corresponding features has been found, otherwise, it is set to 0.
 *
 * @param err output vector of errors; each element of the vector is set to an error for the
 * corresponding feature, type of the error measure can be set in flags parameter; if the flow wasn't
 * found then the error is not defined (use the status parameter to find such cases).
 *
 * @param winSize size of the search window at each pyramid level.
 *
 * @param maxLevel 0-based maximal pyramid level number; if set to 0, pyramids are not used (single
 * level), if set to 1, two levels are used, and so on; if pyramids are passed to input then algorithm
 * will use as many levels as pyramids have but no more than maxLevel.
 *
 * @param criteria parameter, specifying the termination criteria of the iterative search algorithm
 * (after the specified maximum number of iterations criteria.maxCount or when the search window moves
 * by less than criteria.epsilon.
 *
 * @param flags operation flags:
 * OPTFLOW_USE_INITIAL_FLOW uses initial estimations, stored in nextPts; if the flag is not set, then
 * prevPts is copied to nextPts and is considered the initial estimate.OPTFLOW_LK_GET_MIN_EIGENVALS use
 * minimum eigen values as an error measure (see minEigThreshold description); if the flag is not set,
 * then L1 distance between patches around the original and a moved point, divided by number of pixels
 * in a window, is used as a error measure.
 *
 * @param minEigThreshold the algorithm calculates the minimum eigen value of a 2x2 normal matrix of
 * optical flow equations (this matrix is called a spatial gradient matrix in Bouguet00), divided by
 * number of pixels in a window; if this value is less than minEigThreshold, then a corresponding
 * feature is filtered out and its flow is not processed, so it allows to remove bad points and get a
 * performance boost.
 */
export declare function calcOpticalFlowPyrLK(prevImg: InputArray, nextImg: InputArray, prevPts: InputArray, nextPts: InputOutputArray, status: OutputArray, err: OutputArray, winSize?: Size, maxLevel?: int, criteria?: TermCriteria, flags?: int, minEigThreshold?: double): void;
/**
 * See the OpenCV sample camshiftdemo.c that tracks colored objects.
 *
 * (Python) A sample explaining the camshift tracking algorithm can be found at
 * opencv_source_code/samples/python/camshift.py
 *
 * @param probImage Back projection of the object histogram. See calcBackProject.
 *
 * @param window Initial search window.
 *
 * @param criteria Stop criteria for the underlying meanShift. returns (in old interfaces) Number of
 * iterations CAMSHIFT took to converge The function implements the CAMSHIFT object tracking algorithm
 * Bradski98 . First, it finds an object center using meanShift and then adjusts the window size and
 * finds the optimal rotation. The function returns the rotated rectangle structure that includes the
 * object position, size, and orientation. The next position of the search window can be obtained with
 * RotatedRect::boundingRect()
 */
export declare function CamShift(probImage: InputArray, window: any, criteria: TermCriteria): RotatedRect;
/**
 * [findTransformECC]
 *
 * @param templateImage single-channel template image; CV_8U or CV_32F array.
 *
 * @param inputImage single-channel input image to be warped to provide an image similar to
 * templateImage, same type as templateImage.
 *
 * @param inputMask An optional mask to indicate valid values of inputImage.
 */
export declare function computeECC(templateImage: InputArray, inputImage: InputArray, inputMask?: InputArray): double;
/**
 * The function finds an optimal affine transform *[A|b]* (a 2 x 3 floating-point matrix) that
 * approximates best the affine transformation between:  In case of point sets, the problem is
 * formulated as follows: you need to find a 2x2 matrix *A* and 2x1 vector *b* so that:
 *
 * `\\[[A^*|b^*] = arg \\min _{[A|b]} \\sum _i \\| \\texttt{dst}[i] - A { \\texttt{src}[i]}^T - b \\|
 * ^2\\]` where src[i] and dst[i] are the i-th points in src and dst, respectively `$[A|b]$` can be
 * either arbitrary (when fullAffine=true ) or have a form of `\\[\\begin{bmatrix} a_{11} & a_{12} &
 * b_1 \\\\ -a_{12} & a_{11} & b_2 \\end{bmatrix}\\]` when fullAffine=false.
 *
 * [estimateAffine2D], [estimateAffinePartial2D], [getAffineTransform], [getPerspectiveTransform],
 * [findHomography]
 *
 * @param src First input 2D point set stored in std::vector or Mat, or an image stored in Mat.
 *
 * @param dst Second input 2D point set of the same size and the same type as A, or another image.
 *
 * @param fullAffine If true, the function finds an optimal affine transformation with no additional
 * restrictions (6 degrees of freedom). Otherwise, the class of transformations to choose from is
 * limited to combinations of translation, rotation, and uniform scaling (4 degrees of freedom).
 */
export declare function estimateRigidTransform(src: InputArray, dst: InputArray, fullAffine: bool): Mat;
/**
 * The function estimates the optimum transformation (warpMatrix) with respect to ECC criterion (EP08),
 * that is
 *
 * `\\[\\texttt{warpMatrix} = \\texttt{warpMatrix} = \\arg\\max_{W}
 * \\texttt{ECC}(\\texttt{templateImage}(x,y),\\texttt{inputImage}(x',y'))\\]`
 *
 * where
 *
 * `\\[\\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = W \\cdot \\begin{bmatrix} x \\\\ y \\\\ 1
 * \\end{bmatrix}\\]`
 *
 * (the equation holds with homogeneous coordinates for homography). It returns the final enhanced
 * correlation coefficient, that is the correlation coefficient between the template image and the
 * final warped input image. When a `$3\\times 3$` matrix is given with motionType =0, 1 or 2, the
 * third row is ignored.
 *
 * Unlike findHomography and estimateRigidTransform, the function findTransformECC implements an
 * area-based alignment that builds on intensity similarities. In essence, the function updates the
 * initial transformation that roughly aligns the images. If this information is missing, the identity
 * warp (unity matrix) is used as an initialization. Note that if images undergo strong
 * displacements/rotations, an initial transformation that roughly aligns the images is necessary
 * (e.g., a simple euclidean/similarity transform that allows for the images showing the same image
 * content approximately). Use inverse warping in the second image to take an image close to the first
 * one, i.e. use the flag WARP_INVERSE_MAP with warpAffine or warpPerspective. See also the OpenCV
 * sample image_alignment.cpp that demonstrates the use of the function. Note that the function throws
 * an exception if algorithm does not converges.
 *
 * [computeECC], [estimateAffine2D], [estimateAffinePartial2D], [findHomography]
 *
 * @param templateImage single-channel template image; CV_8U or CV_32F array.
 *
 * @param inputImage single-channel input image which should be warped with the final warpMatrix in
 * order to provide an image similar to templateImage, same type as templateImage.
 *
 * @param warpMatrix floating-point $2\times 3$ or $3\times 3$ mapping matrix (warp).
 *
 * @param motionType parameter, specifying the type of motion:
 * MOTION_TRANSLATION sets a translational motion model; warpMatrix is $2\times 3$ with the first
 * $2\times 2$ part being the unity matrix and the rest two parameters being estimated.MOTION_EUCLIDEAN
 * sets a Euclidean (rigid) transformation as motion model; three parameters are estimated; warpMatrix
 * is $2\times 3$.MOTION_AFFINE sets an affine motion model (DEFAULT); six parameters are estimated;
 * warpMatrix is $2\times 3$.MOTION_HOMOGRAPHY sets a homography as a motion model; eight parameters
 * are estimated;`warpMatrix` is $3\times 3$.
 *
 * @param criteria parameter, specifying the termination criteria of the ECC algorithm;
 * criteria.epsilon defines the threshold of the increment in the correlation coefficient between two
 * iterations (a negative criteria.epsilon makes criteria.maxcount the only termination criterion).
 * Default values are shown in the declaration above.
 *
 * @param inputMask An optional mask to indicate valid values of inputImage.
 *
 * @param gaussFiltSize An optional value indicating size of gaussian blur filter; (DEFAULT: 5)
 */
export declare function findTransformECC(templateImage: InputArray, inputImage: InputArray, warpMatrix: InputOutputArray, motionType: int, criteria: TermCriteria, inputMask: InputArray, gaussFiltSize: int): double;
/**
 * This is an overloaded member function, provided for convenience. It differs from the above function
 * only in what argument(s) it accepts.
 */
export declare function findTransformECC(templateImage: InputArray, inputImage: InputArray, warpMatrix: InputOutputArray, motionType?: int, criteria?: TermCriteria, inputMask?: InputArray): double;
/**
 * @param probImage Back projection of the object histogram. See calcBackProject for details.
 *
 * @param window Initial search window.
 *
 * @param criteria Stop criteria for the iterative search algorithm. returns : Number of iterations
 * CAMSHIFT took to converge. The function implements the iterative object search algorithm. It takes
 * the input back projection of an object and the initial position. The mass center in window of the
 * back projection image is computed and the search window center shifts to the mass center. The
 * procedure is repeated until the specified number of iterations criteria.maxCount is done or until
 * the window center shifts by less than criteria.epsilon. The algorithm is used inside CamShift and,
 * unlike CamShift , the search window size or orientation do not change during the search. You can
 * simply pass the output of calcBackProject to this function. But better results can be obtained if
 * you pre-filter the back projection and remove the noise. For example, you can do this by retrieving
 * connected components with findContours , throwing away contours with small area ( contourArea ), and
 * rendering the remaining contours with drawContours.
 */
export declare function meanShift(probImage: InputArray, window: any, criteria: TermCriteria): int;
/**
 * The function readOpticalFlow loads a flow field from a file and returns it as a single matrix.
 * Resulting [Mat] has a type CV_32FC2 - floating-point, 2-channel. First channel corresponds to the
 * flow in the horizontal direction (u), second - vertical (v).
 *
 * @param path Path to the file to be loaded
 */
export declare function readOpticalFlow(path: any): Mat;
/**
 * The function stores a flow field in a file, returns true on success, false otherwise. The flow field
 * must be a 2-channel, floating-point matrix (CV_32FC2). First channel corresponds to the flow in the
 * horizontal direction (u), second - vertical (v).
 *
 * @param path Path to the file to be written
 *
 * @param flow Flow field to be stored
 */
export declare function writeOpticalFlow(path: any, flow: InputArray): bool;
export declare const OPTFLOW_USE_INITIAL_FLOW: any;
export declare const OPTFLOW_LK_GET_MIN_EIGENVALS: any;
export declare const OPTFLOW_FARNEBACK_GAUSSIAN: any;
export declare const MOTION_TRANSLATION: any;
export declare const MOTION_EUCLIDEAN: any;
export declare const MOTION_AFFINE: any;
export declare const MOTION_HOMOGRAPHY: any;
