const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
    uploadContainer: {
        border: `solid 3px ${theme.palette.primary.main}`,
        padding: "25px",
        marginTop: "25px",
        marginBottom: "25px",
        '&:hover': {
            color: theme.palette.primary.main
        }
    },

    Input: {
        display: "none"
    },

    wrapper: {
        width: "50%",
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            fontSize: "1.5rem",
            width: "80%"
        }
    },

    Typography: {
        [theme.breakpoints.down('xs')]: {
            fontSize: "1.5rem",
            color: "red",
            width: "100%"
        }
    }
}))

export default useStyles