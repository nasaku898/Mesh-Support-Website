
import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import "./style.css"
import { Switch, Typography, Button, ButtonGroup, Box, Input, Grid, LinearProgress } from '@material-ui/core'
import ErrorAlert from '../ErrorAlert/ErrorAlert'
import useStyles from './STLCanvasStyle'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const STLCanvas = () => {
    const mount = useRef(null)
    const scene = useRef(null)
    const camera = useRef()
    const handleSize = useRef(null)
    const defaultCameraPosition = useRef(new THREE.Vector3(0, 0, 100))
    const planeSize = 60

    //States
    const [enableWireFrame, setEnableWireFrame] = useState(false)
    const [canvasLoaded, setCanvasLoaded] = useState(false)
    const [modelLoaded, setModelLoaded] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [fileName, setfileName] = useState(null)
    const [showProgress, setShowProgress] = useState(false)

    const sceneNames = {
        mainPlane: "mainPlane",
        gridFloor: "gridFloor",
        mainLight: "mainLight",
        stlModel: "stlModel",
        wireFrame: "wireFrame"
    }

    const classes = useStyles()

    useEffect(() => {

        if (canvasLoaded) {
            return
        }

        let width = mount.current.clientWidth
        let height = mount.current.clientHeight
        let renderer, control

        const init = () => {
            scene.current = new THREE.Scene()
            camera.current = new THREE.PerspectiveCamera(85, width / height, 0.1, 1000)
            renderer = new THREE.WebGLRenderer({ antialias: true })
            control = new OrbitControls(camera.current, renderer.domElement)

            renderer.setSize(width, height)
            renderer.shadowMap.enabled = true

            scene.current.background = new THREE.Color(0x72645b)

            camera.current.lookAt(scene.current.position)
            camera.current.position.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, defaultCameraPosition.current.z)

            createPlane()
            mount.current.appendChild(renderer.domElement)

            control.addEventListener('change', updateLight)
            window.addEventListener('resize', handleResize, false)
        }

        const createPlane = () => {
            var plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(planeSize, planeSize),
                new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
            )
            plane.name = sceneNames.mainPlane
            plane.rotation.x = - Math.PI / 2
            plane.position.y = - 0.5
            scene.current.add(plane)
        }

        const createGridFloor = () => {
            const size = planeSize
            const divisions = planeSize
            const gridHelper = new THREE.GridHelper(size, divisions)
            gridHelper.name = sceneNames.gridFloor
            scene.current.add(gridHelper)
        }

        const addLight = () => {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(1, 1, 1).normalize()

            light.name = sceneNames.mainLight
            scene.current.add(light)
        }

        const handleResize = () => {
            width = mount.current.clientWidth
            height = mount.current.clientHeight
            renderer.setSize(width, height)
            camera.current.aspect = width / height
            camera.current.updateProjectionMatrix()
        }
        //Bind the function to the global one
        handleSize.current = handleResize

        const updateLight = () => {
            const light = scene.current.getObjectByName(sceneNames.mainLight)
            light.position.copy(camera.current.position)
        }
        const animate = () => {
            requestAnimationFrame(animate)
            control.update()
            control.enableZoom = true
            render()
        }

        const render = () => {
            renderer.render(scene.current, camera.current)
        }

        init()
        addLight()
        createGridFloor()
        animate()
        setCanvasLoaded(true)

    }, [defaultCameraPosition, sceneNames, canvasLoaded])

    //Remove event listener when component unmount
    useEffect(() => {
        return () => {
            window.removeEventListener('resize', handleSize.current, false)
        }
    }, [])

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
                    console.log(mesh.geometry)
                    console.log(mesh)
                    console.log(mesh.geometry.boundingSphere)
                    camera.current.position.z = mesh.geometry.boundingSphere.radius
                    defaultCameraPosition.current.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, camera.current.position.z)
                    mesh.position.y += -mesh.geometry.boundingBox.min.z * 0.5
                    mesh.name = sceneNames.stlModel
                    scene.current.add(mesh)
                    threeDView()
                    const canvas = document.getElementById('stlCanvas')

                    canvas.style.visibility = 'visible'
                    setModelLoaded(true)
                    setUploadSuccess(true)
                })
            }
        } catch (error) {
            setErrorMessage(error.message)
            setUploadSuccess(false)
        }
    }

    const toggleWireFrame = () => {
        if (!enableWireFrame) {
            const enableWireFrame = () => {
                const mesh = scene.current.getObjectByName(sceneNames.stlModel)

                const geo = new THREE.WireframeGeometry(mesh.geometry)

                const mat = new THREE.MeshPhongMaterial({ color: 0xff00ff })

                const wireframe = new THREE.LineSegments(geo, mat)
                wireframe.name = sceneNames.wireFrame
                wireframe.rotation.x = - Math.PI / 2
                wireframe.scale.set(0.5, 0.5, 0.5)
                wireframe.position.y += -mesh.geometry.boundingBox.min.z / 2

                scene.current.add(wireframe)

                setEnableWireFrame(true)
            }
            enableWireFrame()
        } else {
            const wireframe = scene.current.getObjectByName(sceneNames.wireFrame)
            scene.current.remove(wireframe)
            setEnableWireFrame(false)
        }
    }

    const resetView = () => {
        camera.current.position.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, defaultCameraPosition.current.z)
    }

    const resetModelPosition = () => {
        const mesh = scene.current.getObjectByName(sceneNames.stlModel)
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

    const removeModel = () => {
        const mesh = scene.current.getObjectByName(sceneNames.stlModel)
        scene.current.remove(mesh)
        setModelLoaded(false)
        setfileName(null)
        resetView()
        const canvas = document.getElementById('stlCanvas')
        canvas.style.visibility = 'hidden'
    }

    const getFileName = () => {
        setfileName(document.getElementById('file').value.split(/(\\|\/)/g).pop())
    }

    const generateSupport = () => {
        // make api call here:
        const test = () => {
            setShowProgress(false)
        }
        setShowProgress(true)
        setTimeout(test, 10000)
    }

    return (
        <>
            <div className={classes.stlCanvasWrapper} >
                <Box>
                    {
                        (!modelLoaded) &&
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
                </Box>

                <div className={classes.stlCanvas} ref={mount} id="stlCanvas"></div>

                {
                    (modelLoaded) &&
                    <>
                        <Grid container spacing={0} className={classes.gridContainer}>
                            <Grid item xs={12} md={8} >
                                <div className={classes.menuItem}>
                                    <Typography>Orientation</Typography>
                                    <div className={classes.buttonGroupWrapper}>
                                        <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.ButtonGroup}>
                                            <Button onClick={leftSideView}>Left</Button>
                                            <Button onClick={rightSideView}>Right</Button>
                                            <Button onClick={topView}>Top</Button>
                                            <Button onClick={frontView}>Front</Button>
                                            <Button onClick={threeDView}>3D</Button>
                                        </ButtonGroup>
                                    </div>


                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <Typography className={classes.wireframe}>Wireframe</Typography>
                                    <Switch
                                        checked={enableWireFrame}
                                        onChange={toggleWireFrame}
                                        name="checkedA"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2} className={classes.menuItem}>
                                <Button
                                    onClick={removeModel}
                                    variant="contained"
                                    color="primary"
                                    className={classes.removeBtn} >
                                    Remove Model
                                    </Button>
                            </Grid>
                            <Grid item xs={12} className={classes.progressBar} >
                                <Button
                                    onClick={generateSupport}
                                    variant="contained"
                                    color="primary"
                                    className={classes.removeBtn} >
                                    Generate Support
                                    </Button>
                                {
                                    (showProgress) &&
                                    <LinearProgress color="secondary" className={classes.progressBar}></LinearProgress>
                                }

                            </Grid>

                        </Grid>
                    </>
                }
            </div>
        </>
    )
}

export default STLCanvas