import React, { useContext } from 'react'
import { Typography, ButtonGroup, Button } from '@material-ui/core'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
const OrientationButton = () => {

    const { scene, camera, defaultCameraPosition, sceneNames } = useContext(CanvasContext)

    const resetView = () => {
        camera.current.position.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, defaultCameraPosition.current.z)
    }

    const resetModelPosition = () => {
        const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)
        mesh.rotation.z = 0
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
        resetModelPosition()
    }

    const threeDView = () => {
        resetView()
        resetModelPosition()

        camera.current.position.x = Math.sin(-Math.PI / 4) * defaultCameraPosition.current.z
        camera.current.position.z = Math.cos(-Math.PI / 4) * defaultCameraPosition.current.z
        camera.current.position.y = defaultCameraPosition.current.z
    }

    return (
        <>
            <Typography>Orientation</Typography>

            <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                <Button onClick={leftSideView} >Left</Button>
                <Button onClick={rightSideView} >Right</Button>
                <Button onClick={topView} >Top</Button>
                <Button onClick={frontView} >Front</Button>
                <Button onClick={threeDView} >3D</Button>
            </ButtonGroup>
        </>
    )
}

export default OrientationButton
