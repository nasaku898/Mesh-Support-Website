
import React, { useRef, useEffect, useState, useContext } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Button, Grid, Typography } from '@material-ui/core'
import useStyles from './STLCanvasStyle'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import OrientationButton from '../OrientationButton/OrientationButton'
import WireframeSwitch from '../WireframeSwitch/WireframeSwitch'
import GenerateSupporButton from '../GenerateSupportButton/GenerateSupportButton'
import UploadSTL from '../UploadSTL/UploadSTL'
import TransformControls from '../TransformControls/TransformControls'
import AddIcon from '@material-ui/icons/Add'
const STLCanvas = () => {

    const { scene, camera, renderer, defaultCameraPosition, orbitControls, sceneNames } = useContext(CanvasContext)

    const mount = useRef(null)

    const handleSize = useRef(null)
    const planeSize = 60

    //States
    const [canvasLoaded, setCanvasLoaded] = useState(false)
    const [modelLoaded, setModelLoaded] = useState(false)

    const classes = useStyles()

    useEffect(() => {

        if (canvasLoaded) {
            return
        }

        let width = mount.current.clientWidth
        let height = mount.current.clientHeight
        const init = () => {
            scene.current = new THREE.Scene()
            camera.current = new THREE.PerspectiveCamera(85, width / height, 0.1, 1000)
            renderer.current = new THREE.WebGLRenderer({ antialias: true })
            orbitControls.current = new OrbitControls(camera.current, renderer.current.domElement)
            renderer.current.setSize(width, height)
            renderer.current.shadowMap.enabled = true

            scene.current.background = new THREE.Color(0x72645b)

            camera.current.lookAt(scene.current.position)
            camera.current.position.set(defaultCameraPosition.current.x, defaultCameraPosition.current.y, defaultCameraPosition.current.z)

            createPlane()
            mount.current.appendChild(renderer.current.domElement)

            orbitControls.current.addEventListener('change', updateLight)
            window.addEventListener('resize', handleResize, false)
        }

        const createPlane = () => {
            var plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(planeSize, planeSize),
                new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
            )
            plane.name = sceneNames.current.mainPlane
            plane.rotation.x = - Math.PI / 2
            plane.position.y = - 0.5
            scene.current.add(plane)
        }

        const createGridFloor = () => {
            const size = planeSize
            const divisions = planeSize
            const gridHelper = new THREE.GridHelper(size, divisions)
            gridHelper.name = sceneNames.current.gridFloor
            scene.current.add(gridHelper)
        }

        const addLight = () => {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(1, 1, 1).normalize()

            light.name = sceneNames.current.mainLight
            scene.current.add(light)
        }

        const handleResize = () => {
            width = mount.current.clientWidth
            height = mount.current.clientHeight
            renderer.current.setSize(width, height)
            camera.current.aspect = width / height
            camera.current.updateProjectionMatrix()
        }
        //Bind the function to the global one
        handleSize.current = handleResize

        const updateLight = () => {
            const light = scene.current.getObjectByName(sceneNames.current.mainLight)
            light.position.copy(camera.current.position)
        }
        const animate = () => {
            requestAnimationFrame(animate)
            orbitControls.current.update()
            orbitControls.current.enableZoom = true
            render()
        }

        const render = () => {
            renderer.current.render(scene.current, camera.current)
        }

        init()
        addLight()
        createGridFloor()
        animate()
        setCanvasLoaded(true)

    }, [defaultCameraPosition, sceneNames, canvasLoaded, camera, scene, renderer, orbitControls])

    //Remove event listener when component unmount
    useEffect(() => {
        return () => {
            window.removeEventListener('resize', handleSize.current, false)
        }
    }, [])

    const removeModel = () => {
        const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)
        scene.current.remove(mesh)

        hideCanvas()
    }
    const hideCanvas = () =>{
        setModelLoaded(false)
        const canvas = document.getElementById('stlCanvas')
        canvas.style.visibility = 'hidden'
    }
    return (
        <>
            <div className={classes.stlCanvasWrapper} >
                {
                    (!modelLoaded) &&
                    <UploadSTL setModelLoaded={setModelLoaded}></UploadSTL>
                }
                
                <div className={classes.stlCanvas} ref={mount} id="stlCanvas"></div>

                {
                    (modelLoaded) &&
                    <>
                        <Grid container spacing={0} className={classes.gridContainer}>
                            <Grid item xs={12} md={3} >
                                <div className={classes.menuItem}>
                                    <OrientationButton></OrientationButton>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <div className={classes.menuItem}>
                                    <TransformControls></TransformControls>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <WireframeSwitch></WireframeSwitch>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <Button onClick={hideCanvas}><Typography>Add Model</Typography><AddIcon/></Button>
                                </div>
                                
                                </Grid>
                            <Grid item xs={12} md={2} >
                                <div className={classes.menuItem}>
                                    <Button
                                        onClick={removeModel}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Remove Model
                                </Button>
                                </div>

                            </Grid>
                            <Grid item xs={12} >
                                <GenerateSupporButton></GenerateSupporButton>
                            </Grid>
                        </Grid>
                        
                    </>
                }
            </div>
        </>
    )
}

export default STLCanvas