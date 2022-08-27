import { useState, useEffect } from 'react'
import { CssBaseline, Grid, Box, Typography } from '@mui/material';
import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'
import { getPlacesData } from './api/index'
import { useMap, MapContextProvider } from './context/MapContext'


const HongKongCoords = {
  lat: 22.396427,
  lng: 114.109497
}

const TaiwanCoords = {
  lat: 23.697809,
  lng: 120.960518
}

const Coords = {
  lat: 21.610552780862964,
  lng: 115.50263769778306
}

const Zoom = 12

const Bounds = {
  ne: {
    lat: 27.375766965019274,
    lng: 126.42304785403306
  },
  sw: {
    lat: 15.606212870473103,
    lng: 104.58222754153306
  }
}

function App() {
  const [refresh, setRefresh] = useState(false)
  const [zoom, setZoom] = useState(Zoom)
  const [coords, setCoords] = useState(Coords)
  const [bounds, setBounds] = useState(Bounds)
  const [places, setPlaces] = useState([])


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(() => {
    console.log("bounds:", bounds.sw, bounds.ne)
    if (refresh) {
      getPlacesData(bounds.sw, bounds.ne)
        .then((data) => {
          console.log(data)
          setPlaces(data)
        })
    }
  }, [coords])

  return (
    <>
      <MapContextProvider>
        <CssBaseline />
        <Header />
        <Box m={1}>
          <Grid container spacing={1} style={{ width: '100%' }}>
            <Grid item xs={12} md={4}>
              <List />
            </Grid>
            <Grid item xs={12} md={8}>
              <Map setCoords={setCoords} setBounds={setBounds} bounds={bounds} coords={coords} zoom={zoom} />
            </Grid>
          </Grid>
        </Box>
      </MapContextProvider>
    </>
  )
}

export default App;
