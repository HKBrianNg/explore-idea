import { useState } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { Typography, Autocomplete, TextField, IconButton, Stack } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapContext } from '../../context/MapContext'
import { usePlacesContext } from '../../context/PlacesContext';
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'


const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]
const InitialCoords = {
    lat: 22.302711,
    lng: 114.177216
}

function Map() {
    const [value, setValue] = useState(styleList[0]);
    const [mapref, setMapRef] = useState(null);
    const { options, setOptions, zoom, setZoom, coord, setCoord, centerCoord, setCenterCoord, bounds, setBounds } = useMapContext()
    const { places } = usePlacesContext()



    const handleOnLoad = (map) => {
        setMapRef(map)
    }

    const handleCenterChanged = (event) => {
        // if (mapref) {
        //     setTimeout(() => {
        //         setCenterCoord({ lat: mapref.getCenter().lat(), lng: mapref.getCenter().lng() })
        //     }, 3000)
        //     console.log("centerChange", centerCoord)
        // }
    }

    const handleOnClick = (ev) => {
        setZoom(mapref.getZoom())
        setCoord({ lat: ev.latLng.lat(), lng: ev.latLng.lng() })
        setCenterCoord({ lat: mapref.getCenter().lat(), lng: mapref.getCenter().lng() })
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

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCenterCoord({ lat: latitude, lng: longitude })
            setZoom(11)
        })
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
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <IconButton size='small' onClick={getMyLocation}
                        sx={{ position: 'absolute', top: '1px', left: '180px', zIndex: 10, margin: 0, padding: 2, }}
                    >
                        <MyLocationIcon />
                    </IconButton>
                </div>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '80vh' }}
                    center={centerCoord}
                    zoom={zoom}
                    options={options}
                    onLoad={(map) => handleOnLoad(map)}
                    onCenterChanged={handleCenterChanged}
                    onClick={ev => handleOnClick(ev)}
                >
                </GoogleMap>
                <Stack direction='column'>
                    <Typography p={1} variant='caption'>
                        Zoom({zoom})
                        Coord({coord.lat},{coord.lng})
                        Center({centerCoord.lat}, {centerCoord.lng})
                    </Typography>
                    <Typography p={1} variant='caption'>
                        Bound (ne({bounds.ne.lat}, {bounds.ne.lng}), sw({bounds.sw.lat}, {bounds.sw.lng}))
                    </Typography>
                </Stack>
            </LoadScript>
        </>
    )
}

export default Map