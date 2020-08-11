import React, { useContext } from 'react'
import { Button, Menu, MenuItem, Typography } from '@material-ui/core'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
const OrientationButton = () => {

    const { camera, defaultCameraPosition } = useContext(CanvasContext)

    const resetView = () => {
        camera.current.position.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, defaultCameraPosition.current.z)
    }

    const leftSideView = () => {
        resetView()
        camera.current.position.x = Math.sin(-Math.PI / 2) * defaultCameraPosition.current.z
        camera.current.position.z = Math.cos(-Math.PI / 2) * defaultCameraPosition.current.z
    }

    const rightSideView = () => {
        resetView()
        camera.current.position.x = Math.sin(Math.PI / 2) * defaultCameraPosition.current.z
        camera.current.position.z = Math.cos(Math.PI / 2) * defaultCameraPosition.current.z
    }
    const topView = () => {
        resetView()
        camera.current.position.y = defaultCameraPosition.current.z
        camera.current.position.z = 0
    }

    const frontView = () => {
        resetView()
    }

    const threeDView = () => {
        resetView()

        camera.current.position.x = Math.sin(-Math.PI / 4) * defaultCameraPosition.current.z
        camera.current.position.z = Math.cos(-Math.PI / 4) * defaultCameraPosition.current.z
        camera.current.position.y = defaultCameraPosition.current.z
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Button aria-controls="orientation-menu" aria-haspopup="true" onClick={handleClick} fullWidth>
                <Typography>Select Orientation</Typography>
            </Button>
            <Menu
                id="orientation-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { leftSideView(); handleClose(); }}>Left</MenuItem>
                <MenuItem onClick={() => { rightSideView(); handleClose(); }}>Right</MenuItem>
                <MenuItem onClick={() => { topView(); handleClose(); }}>Top</MenuItem>
                <MenuItem onClick={() => { frontView(); handleClose(); }}>Front</MenuItem>
                <MenuItem onClick={() => { threeDView(); handleClose(); }}>3D</MenuItem>
            </Menu>
        </>
    )
}

export default OrientationButton
