import { useState, useCallback } from 'react'
import { GoogleMap, InfoWindow, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Autocomplete as AutocompleteMui, TextField, IconButton, Stack, Box, Typography, InputBase } from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapContext } from '../../context/MapContext'
import mapGreenStyles from './mapGreenStyles'
import mapWhiteStyles from './mapWhiteStyles'
import mapDarkStyles from './mapDarkStyles'
import { formatRelative } from 'date-fns';
import { alpha, shouldSkipGeneratingVar, styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'


const styleList = [
    'default',
    'GreenStyles',
    'WhiteStyles',
    'DarkStyles'
]

const libraries = ["places"]

const StyledTypography = styled(Typography)(({ theme }) => ({
    display: "none",
    [theme.breakpoints.up('sm')]: {
        display: 'block',
    },
}));

const StyledIcon = styled("div")(({ theme }) => ({
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Search = styled("div")(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    border: '1px solid',
    borderRadius: '5px',
    marginTop: 5,
    marginLeft: 30,
    paddingLeft: 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '40ch' },
}));

function Map() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDyoQSxwHVG2HkR7mfplO--zn4l2ItFSvY",
        libraries
    })
    const mapContainerStyle = { width: '100%', height: '80vh' }
    const [autocomplete, setAutocomplete] = useState(null)
    const [value, setValue] = useState(styleList[0])
    const [searchValue, setSearchValue] = useState('')
    const [mapref, setMapRef] = useState(null);
    const { options, setOptions, zoom, setZoom, setCoord, centerCoord, setCenterCoord,
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
                        <Search>
                            <StyledIcon>
                                <SearchIcon fontSize='medium' />
                            </StyledIcon>
                            <StyledInputBase placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </Search>
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