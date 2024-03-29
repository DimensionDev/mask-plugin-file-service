import { Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'

const useStyles = makeStyles()((theme) => ({
    name: {
        fontSize: 16,
        lineHeight: 1.75,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}))

interface Props {
    name: string
}

export function FileName(props: Props) {
    const { classes } = useStyles()
    return <Typography className={classes.name} children={props.name} title={props.name} />
}
