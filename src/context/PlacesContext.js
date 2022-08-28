import { createContext, useContext, useState } from 'react'

const placesContext = createContext()


export function PlacesContextProvider({ children }) {
    const [places, setPlaces] = useState([])


    return (
        <placesContext.Provider value={{
            places, setPlaces
        }}>
            {children}
        </placesContext.Provider>
    )
}

export function usePlacesContext() {
    return useContext(placesContext)
}
