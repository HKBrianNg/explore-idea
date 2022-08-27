import React, { useState } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { Typography, Autocomplete, TextField } from '@mui/material'
import { useMapContext } from '../../context/MapContext'
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'


const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]


function Map() {
    const [value, setValue] = useState(styleList[0]);
    const [mapref, setMapRef] = useState(null);
    const { options, setOptions, zoom, setZoom, coords, setCoords, bounds, setBounds } = useMapContext()

    const handleOnLoad = (map) => {
        setMapRef(map)
    }

    const handleCenterChanged = () => {
        if (mapref) {
        }
    }

    const handleClick = () => {
        setZoom(mapref.getZoom())
        setCoords({ lat: mapref.getCenter().lat(), lng: mapref.getCenter().lng() })
        setBounds({
            ne: { lat: mapref.getBounds().getNorthEast().lat(), lng: mapref.getBounds().getNorthEast().lng() },
            sw: { lat: mapref.getBounds().getSouthWest().lat(), lng: mapref.getBounds().getSouthWest().lng() }
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
        switch (newValue) {
            case 'WhiteStyles':
                setOptions({ ...options, styles: mapWhiteStyles })
                break
            case 'GreenStyles':
                setOptions({ ...options, styles: mapGreenStyles })
                break
            case 'DarkStyles':
                setOptions({ ...options, styles: mapDarkStyles })
                break
            default:
                setOptions({ ...options, styles: null })
        }
    }


    return (
        <>
            <LoadScript googleMapsApiKey="AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY"  >
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Autocomplete size='small' disablePortal options={styleList} value={value}
                        onChange={handleChange}
                        sx={{ position: 'absolute', top: '1px', right: '1px', zIndex: 10, width: 200, margin: 0, padding: 2, }}
                        renderInput={(params) => <TextField {...params} label="Map Background" />}
                    />
                </div>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '80vh' }}
                    center={coords}
                    zoom={zoom}
                    options={options}
                    onLoad={(map) => handleOnLoad(map)}
                    onCenterChanged={handleCenterChanged}
                    onClick={handleClick}
                >
                </GoogleMap>
                <Typography p={1} variant='caption'>
                    Zood({zoom})
                    Center({coords.lat}, {coords.lng})
                    Bound (ne({bounds.ne.lat}, {bounds.ne.lng}), sw({bounds.sw.lat}, {bounds.sw.lng}))
                </Typography>
            </LoadScript>
        </>
    )
}

export default Map