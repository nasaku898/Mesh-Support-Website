import { AppBar, Button, Link, Toolbar, Typography } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import useStyles from './NavBarStyle';
const NavBar = () => {

    const classes = useStyles()

    return (
        <div >
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

                        <Typography className={classes.BoxStyle}>
                            <Link component={RouterLink} to="/fileConverter" color="inherit">
                                Convert File
                            </Link>
                        </Typography>
                    </div>

                    <Link className={classes.link} component={RouterLink} to="/supportGeneration" color="inherit">
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
