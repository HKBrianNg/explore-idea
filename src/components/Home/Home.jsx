import { CssBaseline, Grid, Box } from '@mui/material';
import Header from '../Header/Header'
import List from '../List/List'
import Map from '../Map/Map'


function Home() {

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