import { MapContextProvider } from './context/MapContext'
import { PlacesContextProvider } from './context/PlacesContext'
import { GolfCoursesContextProvider } from './context/GolfCoursesContext'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
      <MapContextProvider>
        <PlacesContextProvider>
          <GolfCoursesContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </GolfCoursesContextProvider>
        </PlacesContextProvider>
      </MapContextProvider>
    </>
  )
}

export default App;
