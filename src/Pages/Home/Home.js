import { Box, Button, Grid, Link, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import useStyles from './HomeStyle';
const Home = () => {
    const classes = useStyles()

    return (
        <div>
            <Grid container spacing={0}>
                
                <Grid item xs={12} md={6} lg={6}>
                    <Box className={classes.imageHolder}>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Box className={classes.description}>
                        <Typography className={classes.title} variant="h3" align="left">
                            3D STL Model
                            <br />
                            Grid Support
                        </Typography>

                        <Typography className={classes.subtitle} variant="h6" align="left">
                            Generate a grid support structure for your STL model
                        </Typography>

                        <Link className={classes.link} component={RouterLink} to="/supportGeneration" color="inherit">
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.uploadBtn}
                                endIcon={<CloudUploadIcon />}
                            >
                                <Typography>
                                    Upload File
                            </Typography>
                            </Button>
                        </Link>
                        
                    </Box>
               
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
