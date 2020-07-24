import React, { useState, useContext, useEffect } from 'react'
import { Switch, IconButton, Typography, MenuItem, Menu, ButtonGroup, Button } from '@material-ui/core'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import { TransformControls as TransformManipulation } from 'three/examples/jsm/controls/TransformControls'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

const TransformControls = () => {
    const [enableManipulation, setEnableManipulation] = useState(false)
    const { scene, camera, renderer, sceneNames, orbitControls } = useContext(CanvasContext)
    const [meshOriginalPosition, setMeshOriginalPosition] = useState()
    const [meshOriginalRotation, setMeshOriginalRotation] = useState()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const toggleManipulation = () => {
        if (!enableManipulation) {
            const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)
            setMeshOriginalPosition({ x: mesh.position.x, y: mesh.position.y, z: mesh.position.z })
            setMeshOriginalRotation({ x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z })

            const transformControls = new TransformManipulation(camera.current, renderer.current.domElement)

            transformControls.addEventListener('dragging-changed', (event) => { orbitControls.current.enabled = !event.value })
            transformControls.attach(mesh)

            sceneNames.current.transformControls = "transformControls"
            transformControls.name = sceneNames.current.transformControls

            scene.current.add(transformControls)
            setEnableManipulation(true)
        } else {
            removeTransformControls()
        }

    }

    useEffect(() => {
        return () => {
            removeTransformControls()
        }
        // eslint-disable-next-line
    }, [])

    const removeTransformControls = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        scene.current.remove(transformControls)
        setEnableManipulation(false)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTranslation = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        transformControls.setMode("translate")
    }

    const handleRotation = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        transformControls.setMode("rotate")
    }

    const handleScale = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        transformControls.setMode("scale")
    }

    const handleIncrease = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        transformControls.setSize(transformControls.size + 0.1)
    }

    const handleDecrease = () => {
        const transformControls = scene.current.getObjectByName(sceneNames.current.transformControls)
        transformControls.setSize(Math.max(transformControls.size - 0.1, 0.1))
    }

    const handleReset = () => {
        const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)
        mesh.position.set(meshOriginalPosition.x, meshOriginalPosition.y, meshOriginalPosition.z)
        mesh.rotation.set(meshOriginalRotation.x, meshOriginalRotation.y, meshOriginalRotation.z)
    }
    
    return (
        <>
            <Typography> Manipulation</Typography>
            <Switch
                checked={enableManipulation}
                onChange={toggleManipulation}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />

            {
                (enableManipulation) &&
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
            }

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >

                <MenuItem onClick={handleTranslation}>
                    Translate
                </MenuItem>
                <MenuItem onClick={handleRotation}>
                    Rotation
                </MenuItem>
                <MenuItem onClick={handleScale}>
                    Scale
                </MenuItem>
                <MenuItem>
                    <ButtonGroup size="small" aria-label="small outlined button group">
                        <Button onClick={handleIncrease}><AddIcon /></Button>
                        <Button onClick={handleDecrease}><RemoveIcon /></Button>
                    </ButtonGroup>
                </MenuItem>
                <MenuItem onClick={handleReset}>
                    Reset
                </MenuItem>
            </Menu>
        </>
    )
}

export default TransformControls
