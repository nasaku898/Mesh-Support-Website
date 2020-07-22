const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme)=>({
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
    errorMessage: {
        margin: "20px"
    },
}))

export default useStyles