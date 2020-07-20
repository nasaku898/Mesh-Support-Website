import React, { useRef } from 'react'
import * as THREE from 'three'

export const CanvasContext = React.createContext()

const CanvasProvider = ({ children }) => {
    const scene = useRef(null)
    const camera = useRef(null)
    const defaultCameraPosition = useRef(new THREE.Vector3(0, 0, 100))

    const sceneNames = useRef({
        mainPlane: "mainPlane",
        gridFloor: "gridFloor",
        mainLight: "mainLight",
        stlModel: "stlModel",
        wireFrame: "wireFrame"
    })

    return (
        <CanvasContext.Provider value={{
            scene: scene,
            camera: camera,
            defaultCameraPosition: defaultCameraPosition,
            sceneNames: sceneNames
        }}>
            {children}
        </CanvasContext.Provider>
    )
}
export default CanvasProvider