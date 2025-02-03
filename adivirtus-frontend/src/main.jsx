import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Test from './test.jsx'
import ResumeParser from './onboardingModule/resumeParser.jsx'
import JobDescriptionParser from './onboardingModule/jobDescriptionParser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/resume-parser" element={<ResumeParser />} />
        <Route path="/job-description-parser" element={<JobDescriptionParser />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
