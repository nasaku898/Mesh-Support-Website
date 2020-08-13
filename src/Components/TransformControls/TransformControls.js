import React, { useState, useContext, useEffect, useRef } from 'react'
import { Switch, IconButton, Typography, MenuItem, Menu, ButtonGroup, Button } from '@material-ui/core'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import { TransformControls as TransformManipulation } from 'three/examples/jsm/controls/TransformControls'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

const TransformControls = () => {
    const [enableManipulation, setEnableManipulation] = useState(false)
    const { scene, camera, renderer, orbitControls, listOfMesh } = useContext(CanvasContext)

    const listOfControls = useRef([])
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const toggleManipulation = () => {
        if (!enableManipulation) {

            for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
                let mesh = listOfMesh[meshIndex]
                const transformControls = new TransformManipulation(camera.current, renderer.current.domElement)
                transformControls.addEventListener('dragging-changed', (event) => { orbitControls.current.enabled = !event.value })
                transformControls.attach(mesh)

                scene.current.add(transformControls)
                listOfControls.current.push(transformControls)
            }
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
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            scene.current.remove(listOfControls.current[controlIndex])
        }
        setEnableManipulation(false)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTranslation = () => {
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            listOfControls.current[controlIndex].setMode("translate")
        }
    }

    const handleRotation = () => {
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            listOfControls.current[controlIndex].setMode("rotate")
        }
    }

    const handleScale = () => {
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            listOfControls.current[controlIndex].setMode("scale")
        }
    }

    const handleIncrease = () => {
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            const transformControls = listOfControls.current[controlIndex]
            transformControls.setSize(transformControls.size + 0.1)
        }
    }

    const handleDecrease = () => {
        for (let controlIndex = 0; controlIndex < listOfControls.current.length; controlIndex++) {
            const transformControls = listOfControls.current[controlIndex]
            transformControls.setSize(Math.max(transformControls.size - 0.1, 0.1))
        }
    }

    const handleReset = () => {
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            const mesh = listOfMesh[meshIndex]
            mesh.position.set(mesh.originalPosition.x, mesh.originalPosition.y, mesh.originalPosition.z)
            mesh.rotation.set(mesh.originalRotation.x, mesh.originalRotation.y, mesh.originalRotation.z)
            mesh.scale.set(mesh.originalScale.x, mesh.originalScale.y, mesh.originalScale.z)
        }
    }

    const handleApply = () => {
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            const mesh = listOfMesh[meshIndex]
            mesh.originalPosition = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }
            mesh.originalRotation = { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z }
            mesh.originalScale = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z }
        }
    }

    return (
        <>
            <Typography style={{ overflow: "hidden" }}> Manipulation</Typography>
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

                <MenuItem onClick={() => { handleTranslation(); handleClose(); }}>
                    Translate
                </MenuItem>
                <MenuItem onClick={() => { handleRotation(); handleClose(); }}>
                    Rotation
                </MenuItem>
                <MenuItem onClick={() => { handleScale(); handleClose(); }}>
                    Scale
                </MenuItem>
                <MenuItem onClick={() => { handleApply(); handleClose(); }}>
                    Apply
                </MenuItem>
                <MenuItem onClick={() => { handleReset(); handleClose(); }}>
                    Reset
                </MenuItem>
                <MenuItem>
                    <ButtonGroup size="small" aria-label="small outlined button group">
                        <Button onClick={handleIncrease}><AddIcon /></Button>
                        <Button onClick={handleDecrease}><RemoveIcon /></Button>
                    </ButtonGroup>
                </MenuItem>
            </Menu>
        </>
    )
}

export default TransformControls
