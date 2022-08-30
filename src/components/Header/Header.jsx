import { AppBar, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    display: "none",
    [theme.breakpoints.up('sm')]: {
        display: 'block',
    },
}));

function Header() {

    return (
        <AppBar position="static">
            <StyledToolbar>
                <StyledTypography variant="h5">Explore Idea v1.0.0</StyledTypography>
            </StyledToolbar>
        </AppBar>

    );
}

export default Header