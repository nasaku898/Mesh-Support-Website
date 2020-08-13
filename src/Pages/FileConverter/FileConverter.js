import { Box, Button, Grid, Input, Typography } from '@material-ui/core'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import { saveAs } from 'file-saver'
import React, { useState } from 'react'
import * as THREE from 'three'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import ErrorAlert from '../../Components/ErrorAlert/ErrorAlert'
import useStyles from './FileConvertStyle'
const FileConverter = () => {

    const classes = useStyles()

    const [fileName, setfileName] = useState(null)
    const [uploadSuccess, setUploadSuccess] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    const exportOBJ = (mesh) => {
        const exporter = new OBJExporter()
        const file = exporter.parse(mesh)
        let blob = new Blob([file], { type: 'text/plain' })
        const exportFileName = fileName.split('.').shift()
        saveAs(blob, `${exportFileName}.obj`)
    }

    const exportSTL = (mesh) => {
        const exporter = new STLExporter()
        const file = exporter.parse(mesh, { binary: true })
        let blob = new Blob([file], { type: 'text/plain' })
        const exportFileName = fileName.split('.').shift()
        saveAs(blob, `${exportFileName}.stl`)
    }

    const getFileName = () => {
        setfileName(document.getElementById('file').value.split(/(\\|\/)/g).pop())
    }

    const convertSTLtoOBJ = (event) => {
        event.preventDefault()
        try {
            const file = event.target.file.files[0]
            if (file === undefined) {
                throw new Error("No file found")
            }

            if (file.name.split('.').pop().toUpperCase() !== "STL" && file.name.split('.').pop().toUpperCase() !== "OBJ") {
                throw new Error("File type is not supported")
            }

            const STLloader = new STLLoader()
            const OBJloader = new OBJLoader()
            
            const reader = new FileReader()
            
            let mesh = undefined
            
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                if (file.name.split('.').pop().toUpperCase() === "STL") {
                    STLloader.load(event.target.result, geometry => {
                        const material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
                        mesh = new THREE.Mesh(geometry, material)
                        exportOBJ(mesh)
                    })
                } else {
                    OBJloader.load(event.target.result, obj => {
                        mesh = obj.children.pop()
                        exportSTL(mesh)
                    })
                }
            }
        } catch (error) {
            setErrorMessage(error.message)
            setUploadSuccess(false)
        }
    }

    return (
        <div className={classes.wrapper}>

            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Typography variant="h2">Convert STL <SyncAltIcon fontSize='large' /> OBJ</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={convertSTLtoOBJ}>
                        <Input className={classes.Input} type="file" id="file" inputProps={{ accept: ".stl,.obj" }} onChange={getFileName} />
                        <Box className={classes.uploadContainer}>
                            <label htmlFor="file" >

                                <Typography variant="h5" >
                                    {
                                        fileName ? fileName : "Select files for conversion"
                                    }
                                </Typography>
                            </label>

                        </Box>

                        <Button variant="contained" color="primary" type="submit">
                            Convert
                        </Button>

                        {
                            (!uploadSuccess) &&
                            <ErrorAlert message={errorMessage}></ErrorAlert>
                        }
                    </form>
                </Grid>
            </Grid>

        </div>
    )
}

export default FileConverter
