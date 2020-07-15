
import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import "./style.css"
import { Switch, Typography, Button, ButtonGroup, Box, Input, Grid } from '@material-ui/core'
import ErrorAlert from '../ErrorAlert/ErrorAlert'
import useStyles from './STLCanvasStyle'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const STLCanvas = () => {
    const mount = useRef(null)
    const scene = useRef(null)
    const camera = useRef()
    const handleSize = useRef(null)
    const defaultCameraPosition = new THREE.Vector3(0, 0, 40)


    //States
    const [enableWireFrame, setEnableWireFrame] = useState(false)
    const [canvasLoaded, setCanvasLoaded] = useState(false)
    const [modelLoaded, setModelLoaded] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [fileName, setfileName] = useState(null)
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
            control.addEventListener('change', updateLight)
            renderer.setSize(width, height)
            renderer.shadowMap.enabled = true
            scene.current.background = new THREE.Color(0x72645b)
            camera.current.lookAt(scene.current.position)
            camera.current.position.set(defaultCameraPosition.x, defaultCameraPosition.y, defaultCameraPosition.z)

            createPlane()

            mount.current.appendChild(renderer.domElement)
            window.addEventListener('resize', handleResize, false)
        }

        const createPlane = () => {
            var plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(40, 40),
                new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
            )
            plane.name = sceneNames.mainPlane
            plane.rotation.x = - Math.PI / 2
            plane.position.y = - 0.5
            scene.current.add(plane)
        }

        const createGridFloor = () => {
            const size = 40
            const divisions = 80
            const gridHelper = new THREE.GridHelper(size, divisions)
            gridHelper.name = "main-grid"
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

            if (file.name.split('.').pop() !== "stl") {
                throw new Error("File type is not supported")
            }

            console.log(event.target.file.files[0])
            const loader = new STLLoader()
            let reader = new FileReader()
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
                    //mesh.rotateZ(Math.PI / 2)

                    mesh.geometry.computeBoundingBox()
                    mesh.geometry.center()

                    // Adjusting model such that it is on the plane
                    mesh.position.y += -mesh.geometry.boundingBox.min.z / 2
                    mesh.name = sceneNames.stlModel
                    scene.current.add(mesh)

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
        camera.current.position.set(defaultCameraPosition.x, defaultCameraPosition.y, defaultCameraPosition.z)
    }

    const resetModelPosition = () => {
        const mesh = scene.current.getObjectByName(sceneNames.stlModel)
        mesh.rotation.z = 0
    }

    const leftSideView = () => {
        resetView()
        camera.current.position.x = Math.sin(-Math.PI / 2) * defaultCameraPosition.z
        camera.current.position.z = Math.cos(-Math.PI / 2) * defaultCameraPosition.z
    }

    const rightSideView = () => {
        resetView()
        camera.current.position.x = Math.sin(Math.PI / 2) * defaultCameraPosition.z
        camera.current.position.z = Math.cos(Math.PI / 2) * defaultCameraPosition.z

    }
    const topView = () => {
        resetView()
        camera.current.position.y = 50
        camera.current.position.z = 0
    }

    const frontView = () => {
        resetView()
        resetModelPosition()
    }

    const removeModel = () => {
        const mesh = scene.current.getObjectByName(sceneNames.stlModel)
        scene.current.remove(mesh)
        setModelLoaded(false)
        setfileName(null)
        const canvas = document.getElementById('stlCanvas')
        canvas.style.visibility = 'hidden'
    }
    const getFileName = () => {
        setfileName(document.getElementById('file').value.split(/(\\|\/)/g).pop())
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
                                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                                        <Button onClick={leftSideView}>Left</Button>
                                        <Button onClick={rightSideView}>Right</Button>
                                        <Button onClick={topView}>Top</Button>
                                        <Button onClick={frontView}>Front</Button>
                                    </ButtonGroup>

                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <Typography className={classes.test}>Wireframe</Typography>
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
                        </Grid>
                    </>
                }

            </div>
        </>
    )
}

export default STLCanvas
