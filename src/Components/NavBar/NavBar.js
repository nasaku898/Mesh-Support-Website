import React from 'react'
import { AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';
import { Home } from '@material-ui/icons'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useStyles from './NavBarStyle'
import { Link as RouterLink } from "react-router-dom";

const NavBar = () => {
    const classes = useStyles()
    return (
        <div>
            <AppBar position="static">
                <Toolbar >
                    <Link component={RouterLink} to="/" color="inherit">
                        <Home />
                    </Link>

                    <div className={classes.navItems}>
                        <Typography className={classes.BoxStyle} >
                            <Link component={RouterLink} to="/test" color="inherit">
                                About
                            </Link>
                        </Typography>

                        <Typography className={classes.BoxStyle}>
                            <Link href="https://github.com/nasaku898/Mesh-Support-Generator" color="inherit">
                                GitHub
                            </Link>
                        </Typography>
                    </div>

                    <Link className={classes.link} component={RouterLink} to="/test" color="inherit">
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            endIcon={<CloudUploadIcon />}
                        >
                            Upload
                        </Button>
                    </Link>
                    
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar
