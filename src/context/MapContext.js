import { createContext, useContext, useState } from 'react'

const mapContext = createContext()

// show Hong Kong map as default
const InitialZoom = 9
const CaliforniaCoord = {
    lat: 36.778261,
    lng: -119.4179324
}

const InitialCenterCoord = {
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

export function MapContextProvider({ children }) {
    const [zoom, setZoom] = useState(InitialZoom)
    const [centerCoord, setCenterCoord] = useState(CaliforniaCoord)
    const [bounds, setBounds] = useState(InitialBounds)
    const [coord, setCoord] = useState(InitialCenterCoord)
    const [markers, setMarkers] = useState([])
    const [selected, setSelected] = useState(null)


    return (
        <mapContext.Provider value={{
            zoom, setZoom, coord, setCoord, centerCoord, setCenterCoord, bounds, setBounds, markers, setMarkers,
            selected, setSelected
        }}>
            {children}
        </mapContext.Provider>
    )
}

export function useMapContext() {
    return useContext(mapContext)
}