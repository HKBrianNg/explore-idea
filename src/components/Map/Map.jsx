import { useState, useCallback } from 'react'
import { GoogleMap, InfoWindow, LoadScript, Marker, useLoadScript } from '@react-google-maps/api'
import { Typography, Autocomplete, TextField, IconButton, Stack, Paper } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapContext } from '../../context/MapContext'
import { usePlacesContext } from '../../context/PlacesContext';
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import defaultImage from '../../images/Restaurant-Placeholder-001.jpg'
import { formatRelative } from 'date-fns';
import usePlacesAutocomplete from 'use-places-autocomplete';


const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]

const libraries = ["places"]

function Map() {
    const { isLoaded, loadError } = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: "AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY",
        libraries
    })
    const mapContainerStyle = { width: '100%', height: '80vh' }

    const [value, setValue] = useState(styleList[0]);
    const [mapref, setMapRef] = useState(null);
    const { options, setOptions, zoom, setZoom, coord, setCoord, centerCoord, setCenterCoord, bounds, setBounds,
        markers, setMarkers, selected, setSelected } = useMapContext()
    const { places } = usePlacesContext()

    const Search = () => {
        const { ready, value, suggestions: { status, data }, setValue, clearSuggestion } = usePlacesAutocomplete({
            requestOptions: {
                location: { lat: () => 22.302711, lng: () => 114.177216 },
                radius: 200 * 1000,
            }
        })
    }

    const handleOnLoad = (map) => {
        setMapRef(map)
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

        // setBounds({
        //     ne: { lat: mapref.getBounds().getNorthEast().lat(), lng: mapref.getBounds().getNorthEast().lng() },
        //     sw: { lat: mapref.getBounds().getSouthWest().lat(), lng: mapref.getBounds().getSouthWest().lng() }
        // })
    }, [])

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
                <Autocomplete size='small' disablePortal options={styleList} value={value}
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
                {/* <Typography p={0} variant='caption'>
                        Bound (ne({bounds.ne.lat}, {bounds.ne.lng}), sw({bounds.sw.lat}, {bounds.sw.lng}))
                    </Typography> */}
            </Stack>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconButton size='small' onClick={getMyLocation}
                    sx={{ position: 'absolute', top: '1px', left: '180px', zIndex: 10, margin: 0, padding: 2, }}
                >
                    <MyLocationIcon />
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
                            <h2>Bear Spotted!</h2>
                            <p>Spotted {formatRelative(selected.time, new Date())}</p>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </>
    )
}

export default Map