import { createContext, useContext, useState } from 'react'

const mapContext = createContext()

// show Hong Kong map as default
const InitialZoom = 9
const InitialCoords = {
    lat: 22.302711,
    lng: 114.177216
}
const InitialBounds = {
    ne: {
        lat: 23.033882353080422,
        lng: 115.55737347070313
    },
    sw: {
        lat: 21.567692232322745,
        lng: 112.79705852929688
    }
}

const InitialOptions = {
    styles: null,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: false
}


export function MapContextProvider({ children }) {
    const [options, setOptions] = useState(InitialOptions)
    const [refresh, setRefresh] = useState(false)
    const [zoom, setZoom] = useState(InitialZoom)
    const [coords, setCoords] = useState(InitialCoords)
    const [bounds, setBounds] = useState(InitialBounds)

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoords({ lat: latitude, lng: longitude })
        })
    }


    return (
        <mapContext.Provider value={{
            options, setOptions, refresh, setRefresh, zoom, setZoom, coords, setCoords, bounds, setBounds, getMyLocation
        }}>
            {children}
        </mapContext.Provider>
    )
}

export function useMapContext() {
    return useContext(mapContext)
}