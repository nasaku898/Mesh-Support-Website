import React from 'react'
import STLCanvas from '../../Components/STLCanvas/STLCanvas'
import CanvasProvider from '../../Utils/Context/CanvasContext'

export const CanvasContext = React.createContext()

const SupportGenerator = () => {

    return (
        <>
            <CanvasProvider>
                <STLCanvas></STLCanvas>
            </CanvasProvider>
        </>
    )
}

export default SupportGenerator
