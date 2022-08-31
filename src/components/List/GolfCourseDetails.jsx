import { useState } from 'react'
import { Box, CircularProgress, Typography, Card, CardContent, Stack } from '@mui/material'
import { useGolfCoursesContext } from '../../context/GolfCoursesContext'


function GolfCourseDetails({ course }) {
    const [isLoading, setIsloading] = useState(false)
    const { golfCourseDetails, setGolfCourseDetails, getGolfCourseDetails } = useGolfCoursesContext()
    const [isHovering, setIsHovering] = useState(false);


    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleGetData = () => {
        setIsloading(true)
        getGolfCourseDetails(course.zip_code, course.name)
            .then((data) => {
                console.log("Golf course details:", data)
                setGolfCourseDetails(data.course_details.result)
            })
        setIsloading(false)
        if (golfCourseDetails) {
            window.open(golfCourseDetails.url, '_blank');
        }
    }


    return (
        <>
            {
                isLoading ? (
                    <Box sx={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size="5rem" />
                    </Box>
                ) :
                    (
                        <Card elevation={6} sx={{ padding: 0.5 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" sx={{
                                    backgroundColor: isHovering ? 'salmon' : '',
                                    color: isHovering ? 'white' : '',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Stack direction='column'>
                                        <Typography variant="h6" onClick={handleGetData}>{course.name}</Typography>
                                        <Stack direction='row'>
                                            <Typography component="legend">Zip code:</Typography>
                                            <Typography gutterBottom variant="subtitle1">
                                                {course.zip_code}&nbsp;&nbsp;
                                            </Typography>
                                            <Typography component="legend">Distance:</Typography>
                                            <Typography gutterBottom variant="subtitle1">
                                                {course.distance}&nbsp;km
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>

                    )
            }
        </>
    )
}

export default GolfCourseDetails