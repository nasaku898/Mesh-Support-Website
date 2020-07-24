import React, { useState, useContext, useEffect } from 'react'
import { Typography, Switch } from '@material-ui/core'
import useStyles from './WireframeSwitchStyle'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import * as THREE from 'three'

const WireframeSwitch = () => {
    const [enableWireFrame, setEnableWireFrame] = useState(false)
    const classes = useStyles()

    const { scene, sceneNames } = useContext(CanvasContext)

    useEffect(() => {
        return () => {
            // eslint-disable-next-line 
            const wireframe = scene.current.getObjectByName(sceneNames.current.wireFrame)
            // eslint-disable-next-line
            scene.current.remove(wireframe)
        }
    }, [scene, sceneNames])

    const toggleWireFrame = () => {
        if (!enableWireFrame) {
            const enableWireFrame = () => {
                const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)

                const geo = new THREE.WireframeGeometry(mesh.geometry)
                const mat = new THREE.MeshPhongMaterial({ color: 0xff00ff })

                const wireframe = new THREE.LineSegments(geo, mat)
                wireframe.name = "wireframe"
                mesh.add(wireframe)

                wireframe.rotation.x = 2 * Math.PI
                setEnableWireFrame(true)
            }
            enableWireFrame()
        } else {
            const mesh = scene.current.getObjectByName(sceneNames.current.stlModel)
            const wireframe = mesh.getObjectByName("wireframe")
            mesh.remove(wireframe)
            setEnableWireFrame(false)
        }
    }

    return (
        <>
            <Typography className={classes.wireframe}>Wireframe</Typography>
            <Switch
                checked={enableWireFrame}
                onChange={toggleWireFrame}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
        </>
    )
}

export default WireframeSwitch
