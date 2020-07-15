const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
    stlCanvas: {
        width: "100%",
        height: "500px",
        visibility: "hidden",
        border: `solid 3px ${theme.palette.primary.main}`,
        margin: "auto",
        marginTop: "50px"
    },
    
    stlCanvasWrapper: {
        width: "50%",
        height: "100%",
        margin: "auto",
        [theme.breakpoints.down('sm')]: {
            width: "90%"
        }

    },

    Input: {
        display: "none"
    },

    uploadContainer: {
        border: `solid 3px ${theme.palette.primary.main}`,
        padding: "25px",
        marginTop: "25px",
        '&:hover': {
            color: theme.palette.primary.main
        }
    },

    menuItem: {
        border: `solid 1px ${theme.palette.primary.main}`,
        width: "100%",
        padding: "10px",
        margin: "auto"
    },

    errorMessage: {
        margin: "20px"
    },
    
    gridContainer: {
        height: "100%",
        paddingBottom: "100px"
    },
    
    removeBtn: {
        width: "100%"
    },
    
    test: {
        overflow: "hidden"
    }

}))

export default useStyles