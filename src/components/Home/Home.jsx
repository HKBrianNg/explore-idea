import React, { useEffect, useState } from 'react'
import { CssBaseline, Grid, Box } from '@mui/material';
import Header from '../Header/Header'
import List from '../List/List'
import Map from '../Map/Map'
import { useMapContext } from '../../context/MapContext';
import { getPlacesData } from '../../api/index'


function Home() {
    const { refresh, bounds, getMyLocation } = useMapContext()
    const [places, setPlaces] = useState([])

    // get my current location
    useEffect(() => {
        getMyLocation()
    }, [])

    // get data
    useEffect(() => {
        if (refresh) {
            getPlacesData(bounds.sw, bounds.ne)
                .then((data) => {
                    console.log("place bounds:", bounds.sw, bounds.ne)
                    console.log("place data:", data)
                    setPlaces(data)
                })
        }
    }, [refresh])

    return (
        <>
            <CssBaseline />
            <Header />
            <Box m={1}>
                <Grid container spacing={1} style={{ width: '100%' }}>
                    <Grid item xs={12} md={4}>
                        <List />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Map />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Home