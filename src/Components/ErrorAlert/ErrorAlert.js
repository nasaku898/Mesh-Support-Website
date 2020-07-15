import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab';
const ErrorAlert = ({ message }) => {
    return (
        <div>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {message}
            </Alert>
        </div>
    )
}

export default ErrorAlert
