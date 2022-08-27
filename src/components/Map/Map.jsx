import React, { useState, createContext } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { Paper, Typography, useMediaQuery, Rating, Box } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import mapWhiteStyles from './mapWhiteStyles'
import mapGreenStyles from './mapGreenStyles'


function Map({ setCoords, setBounds, bounds, coords, zoom }) {
    const [mapStyle, setMapStyle] = useState(0)
    const [mapref, setMapRef] = useState(null);
    const isMobile = useMediaQuery('(min-width:600px)')
    const mapContext = createContext()


    const containerStyle = {
        width: '100%',
        height: '80vh'
    }

    const options = {
        styles: (mapStyle === 0 ? mapWhiteStyles : mapGreenStyles),
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: false
    }

    const handleOnLoad = (map) => {
        setMapRef(map)
    }

    const handleCenterChanged = () => {
        if (mapref) {
        }
    }

    const handleMapStyle = () => {
        if (mapStyle === 0) {
            setMapStyle(1)
        } else {
            setMapStyle(0)
        }
    }

    const handleClick = () => {
        let lat = mapref.getCenter().lat()
        let lng = mapref.getCenter().lng()
        setCoords({ lat: lat, lng: lng })
        let ne = mapref.getBounds().getNorthEast()
        let sw = mapref.getBounds().getSouthWest()

        setBounds({
            ne: {
                lat: ne.lat(), lng: ne.lng()
            },
            sw: { lat: sw.lat(), lng: sw.lng() }
        })
    }

    return (
        <>
            <LoadScript googleMapsApiKey="AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY"  >
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleMapStyle}>
                    <h2 style={{ position: 'absolute', top: '1px', right: '1px', margin: 0, padding: 2, zIndex: 10, color: 'red' }}>
                        Map Background
                    </h2>
                </div>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={coords}
                    zoom={zoom}
                    options={options}
                    onLoad={(map) => handleOnLoad(map)}
                    onCenterChanged={handleCenterChanged}
                    onClick={handleClick}
                >
                </GoogleMap>
                <Typography p={1} variant='caption'>
                    Center({coords.lat}, {coords.lng})
                    Bound (ne({bounds.ne.lat}, {bounds.ne.lng}), sw({bounds.sw.lat}, {bounds.sw.lng}))
                </Typography>
            </LoadScript>
        </>
    )
}

export default Map