import React from 'react'
import { Typography, BottomNavigation } from '@material-ui/core'
import useStyles from './FooterStyle'

const Footer = () => {
    const classes = useStyles()
    return (
        <div>
            <BottomNavigation className={classes.BottomNavigationStyle}>
                <Typography className={classes.credit}>
                    &copy;{new Date().getFullYear} DAMLab | All rights reserved.
                </Typography>
            </BottomNavigation>
        </div>
    )
}

export default Footer
