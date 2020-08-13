import { Button, LinearProgress } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
import useStyles from './GeneratorSupportButtonStyle'
import mockSTL from './MockData/CubeWired_30mm.stl'
const GenerateSupportButton = () => {

    let { scene, listOfMesh } = useContext(CanvasContext)

    const classes = useStyles()
    const [showProgress, setShowProgress] = useState(false)

    /*To do: connect this button to backend and update view*/
    const generateSupport = async () => {

        const mockLoading = () => {
            return new Promise(resolve=>{
                setTimeout(()=>{
                    resolve()
                },3000)
            })  
        }
        setShowProgress(true)

        await mockLoading().then(()=>{
             setShowProgress(false)
        })
        
        post("backedURL").then((response) => {
            loadSTL(response.file)
        })

    }
    const loadSTL = (file) => {
        const loader = new STLLoader()
        loader.load(file, (geometry) => {

            const material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
            const mesh = new THREE.Mesh(geometry, material)

            mesh.geometry.computeBoundingBox()
            mesh.geometry.center()
            mesh.geometry.computeBoundingSphere()

            mesh.position.y += -mesh.geometry.boundingBox.min.z
            mesh.name = "support.stl"
            removeModel()
            listOfMesh.push(mesh)
            console.log(listOfMesh)
            scene.current.add(mesh)
        })
    }

    const removeModel = () => {
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            scene.current.remove(listOfMesh[meshIndex])
        }
        listOfMesh.splice(0, listOfMesh.length)
    }

    //This is a mock, use api request such as axios to connect to backend
    const post = url => {
        return Promise.resolve(
            {
                file: mockSTL
            }
        )
    }

    return (
        <>
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
        </>
    )
}

export default GenerateSupportButton