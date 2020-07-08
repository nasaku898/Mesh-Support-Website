import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    BoxStyle: {

        padding: "16px",
        display: "inline-block",
        margin: "auto",

        [theme.breakpoints.down('sm')]: {
            margin: "4px",
            padding: "2px"
        }

    },

    navItems: {
        width: "100%"
    },
    
    button: {
        margin: theme.spacing(1),
        width: "150px"
    },

    link: {
        '&:hover': {
            textDecoration: "none"
        }
    }

}))

export default useStyles