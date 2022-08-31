import { useState } from 'react'
import { Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Grid, Button, Stack } from '@mui/material'
import { useGolfCoursesContext } from '../../context/GolfCoursesContext'
import { useMapContext } from '../../context/MapContext'
import GolfCourseDetails from './GolfCourseDetails'

// Circle region in kilometers
const radius = 50

function GolfCourseList() {
    const [isLoading, setIsloading] = useState(false)
    const [type, setType] = useState('GolfCourses')
    const { golfCourses, setGolfCourses, getGolfCourses } = useGolfCoursesContext()
    const { centerCoord } = useMapContext()

    const handleGetData = () => {
        setIsloading(true)
        getGolfCourses(radius, centerCoord.lat, centerCoord.lng)
            // getGolfCourses(radius, '36.56910381018662', '-121.95035631683683')
            .then((data) => {
                console.log("Golf course coord", centerCoord.lat, centerCoord.lng)
                console.log("Golf course data:", data)
                setGolfCourses(data.courses)
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
                        <Box>
                            <Stack display='flex' direction='row' spacing={1}>
                                <FormControl size='small' fullWidth >
                                    <InputLabel>Type</InputLabel>
                                    <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                                        <MenuItem value="GolfCourses">Golf Courses</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant='contained' size='medium' fullWidth onClick={handleGetData}>Get Data</Button>
                            </Stack>
                        </Box>
                        <Grid container spacing={1} sx={{ height: '75vh', overflow: 'auto', }}>
                            {golfCourses?.map((course, i) => (
                                <Grid key={i} item xs={12}>
                                    <GolfCourseDetails course={course} />
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

export default GolfCourseList