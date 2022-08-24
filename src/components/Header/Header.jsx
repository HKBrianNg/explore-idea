import { AppBar, Toolbar, Typography, Box, InputBase } from '@mui/material'
import { Autocomplete } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search'
import { alpha, styled } from '@mui/material/styles'

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
    marginLeft: 20,
    paddingLeft: 6,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
}));



function Header() {


    return (
        <AppBar position="static">
            <StyledToolbar>
                <StyledTypography variant="h5">Explore Idea</StyledTypography>
                <Box display='flex'>
                    <StyledTypography variant="h6">Explore new places</StyledTypography>
                    {/* <Autocomplete> */}
                    <Search>
                        <StyledIcon>
                            <SearchIcon fontSize='medium' />
                        </StyledIcon>
                        <StyledInputBase placeholder="Search..." />
                    </Search>
                    {/* </Autocomplete> */}
                </Box>
            </StyledToolbar>
        </AppBar>

    );
}

export default Header