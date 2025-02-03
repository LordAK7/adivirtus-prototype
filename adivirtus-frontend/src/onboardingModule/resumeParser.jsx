import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResumeParser = () => {
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadStatus(null);
    setShowPreview(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadStatus('error');
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus('error');
      return;
    }

    setUploadedFile(file);
    setUploadStatus(null);
    setShowPreview(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false,
    validator: (file) => {
      if (file.type !== 'application/pdf') {
        return {
          code: 'wrong-file-type',
          message: 'Only PDF files are allowed'
        };
      }
      return null;
    }
  });

  const processResume = async () => {
    if (!uploadedFile || isProcessing) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await fetch('http://localhost:8000/api/parse-resume/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      console.log('Parsed resume data:', data);
      setUploadStatus('success');
      
      // Store the parsed data in localStorage for next steps
      localStorage.setItem('resumeData', JSON.stringify(data.data));
      
      // Navigate to next step after successful parsing
      setTimeout(() => {
        navigate('/job-description-parser');
      }, 1500);

    } catch (error) {
      console.error('Error processing resume:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const dropzoneClasses = `
    relative border rounded-lg p-6 sm:p-8
    transition-all duration-300 ease-out
    text-center cursor-pointer
    ${isDragReject 
      ? 'bg-red-500/5 border-red-500/30' 
      : isDragActive 
        ? 'bg-[#000000] border-teal-500/30' 
        : 'hover:bg-[#050505] hover:border-gray-800 bg-[#000000] border-gray-900'
    }
  `;

  return (
    <div className="min-h-screen bg-[#000000] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Modern Step Indicator */}
            <div className="group relative inline-block mb-6">
              <div className="flex items-center justify-center space-x-2 bg-[#111111] border border-[#222222] rounded-full px-4 py-1.5 hover:border-[#333] transition-colors duration-200">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span className="text-xs font-medium text-gray-400">1/3</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-[#111111] text-gray-300 text-xs py-1.5 px-3 rounded-md whitespace-nowrap border border-[#222222]">
                  Step 1: Resume Analysis
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-l border-t border-[#222222] rotate-45" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">
              Resume Analysis
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Upload your resume to help us understand your professional background.
            </p>
          </motion.div>
        </div>

        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-[0.5px] bg-teal-500/20 rounded-lg blur-sm opacity-40" />
            
            <div
              {...getRootProps()}
              className={dropzoneClasses}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    isDragReject ? 'bg-red-500/5' :
                    isDragActive ? 'bg-teal-500/5' : 'bg-[#111111]'
                  }`}>
                    <svg
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                        isDragReject ? 'text-red-400 scale-110' :
                        isDragActive ? 'text-teal-400 scale-110' : 'text-gray-600'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  {isDragReject ? (
                    <p className="text-base sm:text-lg font-medium text-red-400">
                      Only PDF files are allowed
                    </p>
                  ) : isDragActive ? (
                    <p className="text-base sm:text-lg font-medium text-teal-400">
                      Release to analyze your resume
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-base sm:text-lg text-gray-300">
                        Drop your resume here or{' '}
                        <span className="text-teal-400 hover:text-teal-300 transition-colors duration-200">
                          browse files
                        </span>
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                          PDF format only
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                          </svg>
                          Max 10MB
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#111111] rounded-lg border border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={togglePreview}
              >
                <div className="p-2 bg-[#1A1A1A] rounded-lg group-hover:bg-[#222222] transition-colors">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium group-hover:text-teal-400 transition-colors">
                    {uploadedFile.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to {showPreview ? 'hide' : 'preview'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={processResume}
                  disabled={isProcessing}
                  className={`
                    px-4 py-2 bg-teal-500 text-black font-medium rounded-lg 
                    transition-colors duration-200 text-sm
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-400'}
                  `}
                >
                  {isProcessing ? 'Processing...' : 'Process Resume'}
                </button>
                <button
                  onClick={clearUpload}
                  className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-500 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative w-full h-[400px] bg-[#0A0A0B] rounded-lg border border-gray-800 overflow-hidden mt-4">
                    <iframe
                      src={URL.createObjectURL(uploadedFile) + '#toolbar=0'}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Upload Status */}
        {uploadStatus && !uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            {uploadStatus === 'error' && (
    <motion.div 
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center space-x-2 bg-[#111111] px-4 py-2 rounded-md border border-red-500/20"
    >
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-red-400 text-sm">
            {uploadedFile && uploadedFile.size > 10 * 1024 * 1024 
                ? "File size exceeds 10MB limit" 
                : "Please upload a valid PDF file"}
                </span>
            </motion.div>
        )}
            {uploadStatus === 'uploading' && (
              <div className="inline-flex items-center space-x-2 bg-[#111111] px-4 py-2 rounded-md border border-[#222222]">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-150" />
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-300" />
                <span className="text-gray-400 text-sm">Processing...</span>
              </div>
            )}
            {uploadStatus === 'success' && (
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center space-x-2 bg-[#111111] px-4 py-2 rounded-md border border-teal-500/20"
              >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-teal-400 text-sm">Resume uploaded successfully</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Next Step Button */}
        {uploadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => navigate('/job-description-parser')}
              className="
                px-6 py-3 bg-teal-500 hover:bg-teal-400 
                text-black font-medium rounded-lg
                transition-colors duration-200
                flex items-center space-x-2
              "
            >
              <span>Continue to Next Step</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeParser;
