import { MapContextProvider } from './context/MapContext'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <MapContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MapContextProvider>
    </>
  )
}

export default App;
