import { Button } from '@material-ui/core'
import { saveAs } from 'file-saver'
import React, { useContext } from 'react'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { CanvasContext } from '../../Utils/Context/CanvasContext'
const ExportButton = () => {

    const { listOfMesh } = useContext(CanvasContext)

    const scaleModel = () => {
        const exporter = new STLExporter()
        for (let meshIndex = 0; meshIndex < listOfMesh.length; meshIndex++) {
            const mesh = listOfMesh[meshIndex]
            const exportFile = exporter.parse(mesh)
            let blob = new Blob([exportFile], { type: 'text/plain' })
            saveAs(blob, `${mesh.name}`)
        }
    }

    return (
        <>
            <Button onClick={scaleModel}>Export</Button>
        </>
    )
}

export default ExportButton
