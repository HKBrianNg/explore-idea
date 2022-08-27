import { createContext, useContext, useState } from 'react'

const mapContext = createContext()

// show Hong Kong map as default
const InitialZoom = 12
const InitialCoords = {
    lat: 21.610552780862964,
    lng: 115.50263769778306
}
const InitialBounds = {
    ne: {
        lat: 27.375766965019274,
        lng: 126.42304785403306
    },
    sw: {
        lat: 15.606212870473103,
        lng: 104.58222754153306
    }
}

export function MapContextProvider({ children }) {
    const [zoom, setZoom] = useState(InitialZoom)
    const [coords, setCoords] = useState(InitialCoords)
    const [bounds, setBounds] = useState(InitialBounds)


    return (
        <mapContext.Provider value={{
            zoom, setZoom,
            coords, setCoords,
            bounds, setBounds
        }}>
            {children}
        </mapContext.Provider>
    )
}

export function useMap() {
    return useContext(mapContext)
}