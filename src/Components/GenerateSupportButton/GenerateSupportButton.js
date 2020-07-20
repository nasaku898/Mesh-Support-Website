import React, { useState } from 'react'
import useStyles from './GeneratorSupportButtonStyle'
import { Button, LinearProgress } from '@material-ui/core'
const GenerateSupportButton = () => {

    const classes = useStyles()

    const [showProgress, setShowProgress] = useState(false)

    /*To do: connext this button to backend and update view*/
    const generateSupport = () => {
        // make api call here:
        const test = () => {
            setShowProgress(false)
        }
        setShowProgress(true)
        setTimeout(test, 10000)
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
