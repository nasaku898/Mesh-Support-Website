
import { Button, Grid, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import ExportButton from '../ExportButton/ExportButton'
import GenerateSupporButton from '../GenerateSupportButton/GenerateSupportButton'
import OrientationButton from '../OrientationButton/OrientationButton'
import TransformControls from '../TransformControls/TransformControls'
import UploadSTL from '../UploadSTL/UploadSTL'
import WireframeSwitch from '../WireframeSwitch/WireframeSwitch'
import useStyles from './STLCanvasStyle'
const STLCanvas = () => {

    const { scene, camera, renderer, defaultCameraPosition, orbitControls, sceneNames, listOfMesh } = useContext(CanvasContext)

    const mount = useRef(null)

    const handleSize = useRef(null)

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

            mount.current.appendChild(renderer.current.domElement)

            orbitControls.current.addEventListener('change', updateLight)
            window.addEventListener('resize', handleResize, false)
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
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            scene.current.remove(listOfMesh[meshIndex])
        }
        listOfMesh.splice(0, listOfMesh.length)

        scene.current.remove(scene.current.getObjectByName(sceneNames.current.gridFloor))
        scene.current.remove(scene.current.getObjectByName(sceneNames.current.mainPlane))
        hideCanvas()
    }
    const hideCanvas = () => {
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
                            <Grid item xs={12} md={2} >
                                <div className={classes.menuItem}>
                                    <OrientationButton></OrientationButton>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2}>
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
                                    <Button onClick={hideCanvas} fullWidth><Typography>Add Model</Typography><AddIcon /></Button>
                                </div>

                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <ExportButton></ExportButton>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={2} >
                                <div className={classes.menuItem}>
                                    <Button
                                        onClick={removeModel}
                                        
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