import { Switch, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import * as THREE from 'three'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import useStyles from './WireframeSwitchStyle'

const WireframeSwitch = () => {
    const [enableWireFrame, setEnableWireFrame] = useState(false)
    const classes = useStyles()

    const { scene, sceneNames, listOfMesh } = useContext(CanvasContext)



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
                for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
                    const mesh = listOfMesh[meshIndex]
                    const geo = new THREE.WireframeGeometry(mesh.geometry)
                    const mat = new THREE.MeshPhongMaterial({ color: 0xff00ff })

                    const wireframe = new THREE.LineSegments(geo, mat)
                    wireframe.name = "wireframe"
                    mesh.add(wireframe)
                    wireframe.rotation.x = 2 * Math.PI
                }
                setEnableWireFrame(true)
            }
            enableWireFrame()
        } else {

            for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
                const mesh = listOfMesh[meshIndex]
                const wireframe = mesh.getObjectByName("wireframe")
                mesh.remove(wireframe)
            }

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
