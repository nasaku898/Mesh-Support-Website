const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
    bottomNavigationStyle: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        backgroundColor: theme.palette.primary.main
    },

    credit: {
        padding: "15px"
    }
}))

export default useStyles