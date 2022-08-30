import { useState, useCallback } from 'react'
import { GoogleMap, InfoWindow, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Autocomplete as AutocompleteMui, TextField, IconButton, Stack, Box, } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapContext } from '../../context/MapContext'
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'
import { formatRelative } from 'date-fns';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]

const libraries = ["places"]


function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY",
        libraries
    })
    const mapContainerStyle = { width: '100%', height: '80vh' }
    const [autocomplete, setAutocomplete] = useState(null)
    const [value, setValue] = useState(styleList[0])
    const [mapref, setMapRef] = useState(null);
    const { options, setOptions, zoom, setZoom, setCoord, centerCoord, setCenterCoord, setBounds,
        markers, setMarkers, selected, setSelected } = useMapContext()

    const onLoad = (autoC) => {
        setAutocomplete(autoC)
    }

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat()
        const lng = autocomplete.getPlace().geometry.location.lng()
        setCenterCoord({ lat, lng })
    }

    const handleCenterChanged = () => {
        if (mapref) {
            setTimeout(() => {
                setCenterCoord({ lat: mapref.getCenter().lat(), lng: mapref.getCenter().lng() })
            }, 2000);
        }
    }

    const handleOnZoomChanged = () => {
        if (mapref) {
            setZoom(mapref.getZoom())
        }
    }

    const handleZoomChanged = (e) => {
        setZoom(Number(e.target.value))
    }

    const handleLatChanged = (e) => {
        setCenterCoord({ ...centerCoord, lat: Number(e.target.value) })
    }

    const handleLngChanged = (e) => {
        setCenterCoord({ ...centerCoord, lng: Number(e.target.value) })
    }

    const onMapLoad = useCallback((map) => {
        setMapRef(map)
    }, [])

    const onMapClick = useCallback((event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date(),
        }])
        setCoord({ lat: event.latLng.lat(), lng: event.latLng.lng() })
        if (mapref) {
            setBounds({
                ne: { lat: mapref.getBounds().getNorthEast().lat(), lng: mapref.getBounds().getNorthEast().lng() },
                sw: { lat: mapref.getBounds().getSouthWest().lat(), lng: mapref.getBounds().getSouthWest().lng() }
            })
        }

    }, [])

    const clearMarkers = () => {
        setMarkers([])
    }

    const handleMapStyleChange = (event, newValue) => {
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


    if (loadError) return "Error Loading Maps"
    if (!isLoaded) return "Loading Maps"

    return (
        <>
            <Stack direction='row'>
                <AutocompleteMui size='small' disablePortal options={styleList} value={value}
                    onChange={handleMapStyleChange} sx={{ width: 160, margin: 1, padding: 0, }}
                    renderInput={(params) => <TextField {...params} label="Map Styles" />}
                />
                <TextField variant="outlined" type='number' label='Zoom' size='small' value={zoom} onChange={handleZoomChanged}
                    sx={{ width: 80, margin: 1, padding: 0 }}
                    InputProps={{ inputProps: { max: 22, min: 0 } }} />
                <TextField variant="outlined" type='number' label='Center Latitude' size='small' value={centerCoord.lat} onChange={handleLatChanged}
                    sx={{ width: 120, margin: 1, padding: 0 }}
                    InputProps={{ inputProps: { max: 89, min: -89 } }} />
                <TextField variant="outlined" type='number' label='Center Longtitude' size='small' value={centerCoord.lng} onChange={handleLngChanged}
                    sx={{ width: 120, margin: 1, padding: 0 }}
                    InputProps={{ inputProps: { max: 180, min: -179 } }} />
                <Box display='flex'>
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <TextField variant="outlined" label='Places' size='small'
                            sx={{ width: 300, margin: 1, padding: 0 }}
                            InputProps={{ inputProps: { max: 180, min: -179 }, }} />
                    </Autocomplete>
                </Box>
            </Stack>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconButton size='small' onClick={getMyLocation}
                    sx={{ position: 'absolute', top: '1px', left: '180px', zIndex: 10, margin: 0, padding: 2, }}
                >
                    <MyLocationIcon />
                </IconButton>
            </div>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconButton size='small' onClick={clearMarkers}
                    sx={{ position: 'absolute', top: '1px', left: '230px', zIndex: 10, margin: 0, padding: 2, }}
                >
                    <HighlightOffIcon />
                </IconButton>
            </div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={centerCoord}
                zoom={zoom}
                options={options}
                onLoad={onMapLoad}
                onCenterChanged={handleCenterChanged}
                onClick={onMapClick}
                onZoomChanged={handleOnZoomChanged}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.time.toISOString()}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={{
                            url: "/cat.png",
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15)
                        }}
                        onClick={() => { setSelected(marker) }}
                    />
                ))}
                {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => { setSelected(null) }}>
                        <div>
                            <h5>Marked { }
                                {formatRelative(selected.time, new Date())}
                            </h5>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </>
    )
}

export default Map