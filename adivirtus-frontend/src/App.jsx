import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-4">
      <button
        onClick={() => navigate('/test')}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
      >
        Test
      </button>
      
      <button
        onClick={() => navigate('/resume-parser')}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
      >
        Start Onboarding
      </button>
    </div>
  )
}

export default App
