import { Typography } from '@material-ui/core'
import React from 'react'
import useStyles from './FooterStyle'

const Footer = () => {
    const classes = useStyles()
    return (
        <div className={classes.bottomNavigationStyle}>
            <Typography className={classes.credit}>
                &copy; DAMLab | All rights reserved.
            </Typography>
        </div>
    )
}

export default Footer
