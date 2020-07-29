import React, { useRef } from 'react'
import * as THREE from 'three'

export const CanvasContext = React.createContext()

const CanvasProvider = ({ children }) => {
    const scene = useRef(null)
    const camera = useRef(null)
    const renderer = useRef(null)
    const orbitControls = useRef(null)
    const defaultCameraPosition = useRef(new THREE.Vector3(0, 0, 100))
    const test = {}
    
    const sceneNames = useRef({
        mainPlane: "mainPlane",
        gridFloor: "gridFloor",
        mainLight: "mainLight",
        stlModel: "stlModel",
        wireFrame: "wireFrame"
    })

    const listOfMesh = []

    return (
        <CanvasContext.Provider value={{
            scene: scene,
            camera: camera,
            renderer: renderer,
            defaultCameraPosition: defaultCameraPosition,
            sceneNames: sceneNames,
            orbitControls: orbitControls,
            test: test,
            listOfMesh:listOfMesh
            
        }}>
            {children}
        </CanvasContext.Provider>
    )
}
export default CanvasProvider