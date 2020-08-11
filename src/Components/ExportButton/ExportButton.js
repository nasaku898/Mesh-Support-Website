import { Button } from '@material-ui/core'
import { saveAs } from 'file-saver'
import React, { useContext } from 'react'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
const ExportButton = () => {

    const { listOfMesh } = useContext(CanvasContext)

    const exportSTL = () => {
        const exporter = new STLExporter()
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            const mesh = listOfMesh[meshIndex].clone()
            mesh.scale.set(1, 1, 1)
            const file = exporter.parse(mesh)
            let blob = new Blob([file], { type: 'text/plain' })
            saveAs(blob, `${mesh.name}`)
        }
    }

    return (
        <>
            <Button onClick={exportSTL}>Export</Button>
        </>
    )
}

export default ExportButton
