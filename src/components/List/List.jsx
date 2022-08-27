import React, { useState, useEffect, createRef } from 'react'
import { Box, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material'
import PlaceDetails from '../PlaceDetails/PlaceDetails'


function List() {
    const [elRefs, setElRefs] = useState([]);

    const [type, setType] = useState('restaurants')
    const [rating, setRating] = useState('')

    const [isLoading, setIsloading] = useState(false)

    const places = [
        { name: 'Cool Place' },
        { name: 'Best Beer' },
        { name: 'Best Steak' },
        { name: 'Cool Place' },
        { name: 'Best Beer' },
        { name: 'Best Steak' },
        { name: 'Cool Place' }
    ]


    return (
        <>
            <Box sx={{ padding: '5px' }}>
                <Typography variant="h5">Restaurants, Hotels & Attrations around you</Typography>
                {isLoading ? (
                    <Box sx={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size="5rem" />
                    </Box>
                ) : (
                    <>
                        <FormControl size='small' sx={{ minWidth: '150px', margin: '5px' }}>
                            <InputLabel>Type</InputLabel>
                            <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                                <MenuItem value="restaurants">Restaurants</MenuItem>
                                <MenuItem value="hotels">Hotels</MenuItem>
                                <MenuItem value="attractions">Attractions</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size='small' sx={{ minWidth: '150px', margin: '5px' }}>
                            <InputLabel>Rating</InputLabel>
                            <Select label="Rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                                <MenuItem value="0">All</MenuItem>
                                <MenuItem value="3">Above 3.0</MenuItem>
                                <MenuItem value="4">Above 4.0</MenuItem>
                                <MenuItem value="4.5">Above 4.5</MenuItem>
                            </Select>
                        </FormControl>

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