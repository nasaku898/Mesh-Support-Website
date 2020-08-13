import { Alert, AlertTitle } from '@material-ui/lab';
import React from 'react';
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
