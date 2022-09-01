import { useState, useCallback } from 'react'
import { GoogleMap, InfoWindow, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Autocomplete as AutocompleteMui, TextField, IconButton, Stack, Box, Typography } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'
import { formatRelative } from 'date-fns';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useMapContext } from '../../context/MapContext'
import { useGolfCoursesContext } from '../../context/GolfCoursesContext';

const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]

const libraries = ["places"]

const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
}
const closeOptions = {
    ...defaultOptions,
    zIndex: 3,
    fillOpacity: 0.05,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
}

const middleOptions = {
    ...defaultOptions,
    zIndex: 2,
    fillOpacity: 0.05,
    strokeColor: "#FBC02D",
    fillColor: "#FB02D",
}

const farOptions = {
    ...defaultOptions,
    zIndex: 1,
    fillOpacity: 0.05,
    strokeColor: "#FF5252",
    fillColor: "#FF5252",
}

const initialMapOptions = {
    styles: null,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    clickableIcons: true
}

const mapContainerStyle = { width: '100%', height: '80vh' }

function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY",
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })
    const [autocomplete, setAutocomplete] = useState(null)
    const [mapOptions, setMapOptions] = useState(initialMapOptions)
    const [searchValue, setSearchValue] = useState('')
    const [value, setValue] = useState(styleList[0])
    const [mapref, setMapRef] = useState(null);
    const { zoom, setZoom, setCoord, centerCoord, setCenterCoord, setBounds,
        markers, setMarkers, selected, setSelected } = useMapContext()
    const { golfCourses, setGolfCourses, getGolfCourses } = useGolfCoursesContext()

    // const center = useMemo(() => ({ lat: centerCoord.lat, lng: centerCoord.lng }), [centerCoord])

    const onLoad = (autoC) => {
        setAutocomplete(autoC)
    }

    const onPlaceChanged = () => {
        console.log("place:", autocomplete.getPlace())
        const lat = autocomplete.getPlace().geometry.location.lat()
        const lng = autocomplete.getPlace().geometry.location.lng()
        const icon = autocomplete.getPlace().icon
        const name = autocomplete.getPlace().name
        setMarkers(current => [...current, {
            lat: lat,
            lng: lng,
            time: new Date(),
            icon: icon,
            name: name
        }])
        console.log("Icon:", icon)
        console.log("Name:", name)

        setCenterCoord({ lat, lng })
        setZoom(4)
    }

    const handleCenterChanged = () => {
        if (mapref) {
            setTimeout(() => {
                setCenterCoord({ lat: mapref.getCenter().lat(), lng: mapref.getCenter().lng() })
            }, 1000);
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
        // setMarkers(current => [...current, {
        //     lat: event.latLng.lat(),
        //     lng: event.latLng.lng(),
        //     time: new Date(),
        // }])
        // setCoord({ lat: event.latLng.lat(), lng: event.latLng.lng() })
        // if (mapref) {
        //     setBounds({
        //         ne: { lat: mapref.getBounds().getNorthEast().lat(), lng: mapref.getBounds().getNorthEast().lng() },
        //         sw: { lat: mapref.getBounds().getSouthWest().lat(), lng: mapref.getBounds().getSouthWest().lng() }
        //     })
        // }

    }, [])

    const clearMarkers = () => {
        setMarkers([])
        setSearchValue('')
    }

    const handleMapStyleChange = (event, newValue) => {
        setValue(newValue)
        switch (newValue) {
            case 'WhiteStyles':
                setMapOptions({ ...mapOptions, styles: mapWhiteStyles })
                break
            case 'GreenStyles':
                setMapOptions({ ...mapOptions, styles: mapGreenStyles })
                break
            case 'DarkStyles':
                setMapOptions({ ...mapOptions, styles: mapDarkStyles })
                break
            default:
                setMapOptions({ ...mapOptions, styles: null })
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
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}
                        options={{ fields: ["geometry", "icon", "name"] }}
                    >
                        <TextField variant="outlined" label='Places' size='small' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                            sx={{ width: 300, margin: 1, padding: 0 }}
                            InputProps={{ inputProps: { max: 180, min: -179 }, }} />
                    </Autocomplete>
                    <IconButton size='small' onClick={clearMarkers} >
                        <HighlightOffIcon />
                    </IconButton>
                </Box>
            </Stack>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconButton size='small' onClick={getMyLocation}
                    sx={{ position: 'absolute', top: '1px', left: '180px', zIndex: 10, margin: 0, padding: 2, }}
                >
                    <MyLocationIcon />
                </IconButton>
            </div>
            {/* <div style={{ position: 'relative', cursor: 'pointer' }}>
                <IconButton size='small' onClick={clearMarkers}
                    sx={{ position: 'absolute', top: '1px', left: '230px', zIndex: 10, margin: 0, padding: 2, }}
                >
                    <HighlightOffIcon />
                </IconButton>
            </div> */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={centerCoord}
                zoom={zoom}
                options={mapOptions}
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
                            <Typography variant='h5'>Marked&nbsp; {formatRelative(selected.time, new Date())}</Typography>
                            <Stack direction='row'>
                                <img src={selected.icon} alt="" style={{ width: '30px', height: '30px' }} />
                                <Typography variant='h5' ml={1}>{selected.name}</Typography>
                            </Stack>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </>
    )
}

export default Map