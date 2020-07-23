import React, { useState, useContext } from 'react'
import { Box, Input, Typography, Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ErrorAlert from '../ErrorAlert/ErrorAlert'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import * as THREE from 'three'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import useStyles from './UploadSTLStyle'
import { CreateTransformControls } from '../../Utils/Functions/TransformControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'

const UploadSTL = (props) => {
    const { scene, camera, renderer, defaultCameraPosition, sceneNames, orbitControls } = useContext(CanvasContext)

    const [uploadSuccess, setUploadSuccess] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [fileName, setfileName] = useState(null)

    const classes = useStyles()

    const getFileName = () => {
        setfileName(document.getElementById('file').value.split(/(\\|\/)/g).pop())
    }

    const loadSTL = (event) => {
        event.preventDefault()
        try {
            const file = event.target.file.files[0]

            if (file === undefined) {
                throw new Error("No file found")
            }

            if (file.name.split('.').pop().toUpperCase() !== "STL") {
                throw new Error("File type is not supported")
            }

            const loader = new STLLoader()
            const reader = new FileReader()

            reader.readAsDataURL(event.target.file.files[0])
            reader.onload = (event) => {
                loader.load(event.target.result, geometry => {
                    const material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
                    const mesh = new THREE.Mesh(geometry, material)

                    // Rotate to flat plane
                    mesh.rotation.x = - Math.PI / 2
                    mesh.scale.set(0.5, 0.5, 0.5)
                    mesh.receiveShadow = true
                    mesh.castShadow = true

                    mesh.geometry.computeBoundingBox()
                    mesh.geometry.center()
                    mesh.geometry.computeBoundingSphere()

                    //center mesh
                    camera.current.position.z = mesh.geometry.boundingSphere.radius
                    defaultCameraPosition.current.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, camera.current.position.z)
                    mesh.position.y += -mesh.geometry.boundingBox.min.z * 0.5
                    mesh.name = sceneNames.current.stlModel
                    scene.current.add(mesh)
                    //orbitControls.current.target = mesh.position
                    CreateTransformControls(mesh, camera.current, renderer.current, orbitControls.current, scene.current)
                    /*
                    let objects = [mesh]
                    let dragControls = new DragControls(objects, camera.current, renderer.current.domElement)
                    dragControls.addEventListener('dragstart', function () { orbitControls.current.enabled = false; });
                    dragControls.addEventListener('drag', onDragEvent);
                    dragControls.addEventListener('dragend', function () { orbitControls.current.enabled = true; });
                    */
                    camera.current.position.x = Math.sin(-Math.PI / 4) * defaultCameraPosition.current.z
                    camera.current.position.z = Math.cos(-Math.PI / 4) * defaultCameraPosition.current.z
                    camera.current.position.y = defaultCameraPosition.current.z
                    const canvas = document.getElementById('stlCanvas')

                    canvas.style.visibility = 'visible'
                    props.setModelLoaded(true)
                    setUploadSuccess(true)
                })
            }
        } catch (error) {
            setErrorMessage(error.message)
            setUploadSuccess(false)
        }
    }

    const onDragEvent = (event) => {
        event.object.position.y = -event.object.geometry.boundingBox.min.z * 0.5
    }

    return (
        <>
            {
                <form onSubmit={loadSTL}>
                    <Input className={classes.Input} type="file" id="file" name="file" inputProps={{ accept: ".stl" }} onChange={getFileName} >
                    </Input>
                    <label htmlFor="file">
                        <Box className={classes.uploadContainer}>
                            <Typography variant="h5" >
                                {
                                    (fileName ? fileName : "+ Select a STL file")
                                }
                            </Typography>
                        </Box>
                    </label>
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.uploadBtn}
                        endIcon={<CloudUploadIcon />}
                        type="submit"
                    >
                        <Typography>
                            Load File
                                </Typography>
                    </Button>
                </form>
            }
            {
                (!uploadSuccess) &&
                <div className={classes.errorMessage}>
                    <ErrorAlert message={errorMessage}></ErrorAlert>
                </div>
            }
        </>
    )
}

export default UploadSTL
