import React, { useState } from 'react'
import { Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Grid, Button, Stack } from '@mui/material'
import PlaceDetails from '../PlaceDetails/PlaceDetails'
import { useMapContext } from '../../context/MapContext'
import { getPlacesData } from '../../api/index'


function List() {
    const [type, setType] = useState('restaurants')
    const [places, setPlaces] = useState([])
    const [isLoading, setIsloading] = useState(false)
    const { bounds } = useMapContext()


    const handleGetData = () => {
        setIsloading(true)
        getPlacesData(bounds.sw, bounds.ne)
            .then((data) => {
                console.log("place bounds:", bounds.sw, bounds.ne)
                console.log("place data:", data)
                setPlaces(data)
            })
        setIsloading(false)
    }

    return (
        <>
            <Box sx={{ padding: '5px' }}>
                {isLoading ? (
                    <Box sx={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size="5rem" />
                    </Box>
                ) : (
                    <>
                        <Stack display='flex' spacing={1}>
                            <FormControl size='small' fullWidth >
                                <InputLabel>Type</InputLabel>
                                <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                                    <MenuItem value="restaurants">Restaurants</MenuItem>
                                    <MenuItem value="hotels">Hotels</MenuItem>
                                    <MenuItem value="attractions">Attractions</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant='contained' size='medium' fullWidth onClick={handleGetData}>Get Data</Button>
                        </Stack>
                        <Grid container spacing={3} sx={{ height: '75vh', overflow: 'auto', }}>
                            {places?.map((place, i) => (
                                <Grid key={i} item xs={12}>
                                    <PlaceDetails place={place} />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )
                }
            </Box>
        </>
    )
}

export default List