import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    imageStyle: {
        width: "100%",
        height: "100%",
        backgroundPosition: " center center"
    },

    imageHolder: {
        background: "url(https://cdn.discordapp.com/attachments/484102130286854144/730130581437939801/3d-printer.jpg) no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        height: "768px"
    },

    description: {
        height: "768px",
        paddingLeft: "20%",
        paddingRight: "20%",
        paddingTop: "20%",
        paddingBottom: "20%"
    },

    title: {
        margin: "50px 0px 50px 0px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "2.5rem"
        }
    },

    subtitle: {
        margin: "20px 0px 20px 0px",
    },

    uploadBtn: {
        float: "left"
    }
}))

export default useStyles