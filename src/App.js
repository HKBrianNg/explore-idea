import { MapContextProvider } from './context/MapContext'
import { PlacesContextProvider } from './context/PlacesContext'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <MapContextProvider>
        <PlacesContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </PlacesContextProvider>
      </MapContextProvider>
    </>
  )
}

export default App;
