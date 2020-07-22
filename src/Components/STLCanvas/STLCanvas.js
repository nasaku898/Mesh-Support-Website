
import React, { useRef, useEffect, useState, useContext } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { Button, Grid } from '@material-ui/core'
import useStyles from './STLCanvasStyle'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import OrientationButton from '../OrientationButton/OrientationButton'
import WireframeSwitch from '../WireframeSwitch/WireframeSwitch'
import GenerateSupporButton from '../GenerateSupportButton/GenerateSupportButton'
import UploadSTL from '../UploadSTL/UploadSTL'
const STLCanvas = () => {

    const { scene, camera, defaultCameraPosition } = useContext(CanvasContext)

    const mount = useRef(null)

    const handleSize = useRef(null)
    const planeSize = 60

    //States
    const [canvasLoaded, setCanvasLoaded] = useState(false)
    const [modelLoaded, setModelLoaded] = useState(false)
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

    }, [defaultCameraPosition, sceneNames, canvasLoaded, camera, scene])

    //Remove event listener when component unmount
    useEffect(() => {
        return () => {
            window.removeEventListener('resize', handleSize.current, false)
        }
    }, [])


    

    const removeModel = () => {
        const mesh = scene.current.getObjectByName(sceneNames.stlModel)
        scene.current.remove(mesh)

        setModelLoaded(false)
        const canvas = document.getElementById('stlCanvas')
        canvas.style.visibility = 'hidden'
    }


    return (
        <>
            <div className={classes.stlCanvasWrapper} >
                {
                    (!modelLoaded) &&
                    <UploadSTL modelLoaded={modelLoaded} setModelLoaded={setModelLoaded}></UploadSTL>
                }
                

                <div className={classes.stlCanvas} ref={mount} id="stlCanvas"></div>

                {
                    (modelLoaded) &&
                    <>
                        <Grid container spacing={0} className={classes.gridContainer}>
                            <Grid item xs={12} md={8} >
                                <div className={classes.menuItem}>
                                    <OrientationButton></OrientationButton>
                                </div>

                            </Grid>
                            <Grid item xs={12} md={2}>
                                <div className={classes.menuItem}>
                                    <WireframeSwitch></WireframeSwitch>
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