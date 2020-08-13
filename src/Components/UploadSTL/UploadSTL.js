import { Box, Button, Input, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useContext, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { CanvasContext } from '../../Utils/Context/CanvasContext';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import useStyles from './UploadSTLStyle';


const UploadSTL = (props) => {
    let { scene, camera, defaultCameraPosition, listOfMesh } = useContext(CanvasContext)

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
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                loader.load(event.target.result, geometry => {
                    const material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
                    const mesh = new THREE.Mesh(geometry, material)
                    // Rotate to flat plane
                    mesh.rotation.x = - Math.PI / 2
                    mesh.receiveShadow = true
                    mesh.castShadow = true
                    mesh.geometry.computeBoundingBox()
                    mesh.geometry.center()
                    mesh.geometry.computeBoundingSphere()
                    
                    //center mesh
                    camera.current.position.z = mesh.geometry.boundingSphere.radius * 2
                    defaultCameraPosition.current.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, camera.current.position.z)
                    mesh.position.y += -mesh.geometry.boundingBox.min.z
                    mesh.name = file.name

                    mesh.originalPosition = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }
                    mesh.originalRotation = { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z }
                    mesh.originalScale = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z }

                    listOfMesh.push(mesh)
                    scene.current.add(mesh)

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

    return (
        <>
            {
                <form onSubmit={loadSTL}>
                    <Input className={classes.Input} type="file" id="file" name="file" inputProps={{ accept: ".stl" }} onChange={getFileName} >
                    </Input>

                    <Box className={classes.uploadContainer}>
                        <label htmlFor="file">

                            <Typography variant="h5" >
                                {
                                    (fileName ? fileName : "+ Select a STL file")
                                }
                            </Typography>

                        </label>
                    </Box>

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
