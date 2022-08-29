import { Button, DialogActions, DialogContent } from '@mui/material'
import { makeStyles, MaskDialog } from '@masknet/theme'
import { isNil } from 'lodash-unified'
import { useState } from 'react'
import { useI18N } from '@masknet/plugin-hooks'
import { showSnackbar } from '@masknet/plugin/ui'
import { Entry } from './components/index.js'
import { META_KEY_2 } from '../shared/constants.js'
import { Exchange } from './hooks/Exchange.js'
import type { FileInfo, DialogCloseCallback } from '../shared/types.js'
import { attachMetadata, dropMetadata, closeApplicationBoardDialog } from '@masknet/plugin/content-script'

interface Props {
    onClose: () => void
    open: boolean
    isOpenFromApplicationBoard?: boolean
}

const useStyles = makeStyles()((theme) => ({
    actions: {
        alignSelf: 'center',
    },
    button: {
        marginTop: 24,
    },
    paper: {
        width: '600px !important',
        maxWidth: 'none',
        boxShadow: 'none',
        backgroundImage: 'none',
        [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
            display: 'block !important',
            margin: 12,
        },
    },
}))

const FileServiceDialog: React.FC<Props> = (props) => {
    const t = useI18N()
    const { classes } = useStyles()
    const [uploading, setUploading] = useState(false)
    const [selectedFileInfo, setSelectedFileInfo] = useState<FileInfo | null>(null)
    const onInsert = () => {
        if (isNil(selectedFileInfo)) {
            return
        }
        if (selectedFileInfo) {
            attachMetadata(META_KEY_2, JSON.parse(JSON.stringify(selectedFileInfo)))
        } else {
            dropMetadata(META_KEY_2)
        }
        closeApplicationBoardDialog()
        props.onClose()
    }

    let onDialogCloseCallback: DialogCloseCallback | null
    const callDialogClose = () => {
        try {
            onDialogCloseCallback?.()
        } catch (error) {}
        onDialogCloseCallback = null
    }

    const onDecline = () => {
        if (onDialogCloseCallback) {
            callDialogClose()
            return
        }
        if (!uploading) {
            props.onClose()
            return
        }
        showSnackbar(t.uploading_on_cancel())
    }
    const onDialogClose = (cb: DialogCloseCallback) => {
        onDialogCloseCallback = cb
    }
    return (
        <MaskDialog
            // @ts-expect-error
            isOpenFromApplicationBoard={props.isOpenFromApplicationBoard}
            DialogProps={{ scroll: 'paper', classes: { paper: classes.paper } }}
            open={props.open}
            title={t.__display_name()}
            onClose={onDecline}>
            <DialogContent>
                <Exchange onDialogClose={onDialogClose} onUploading={setUploading} onInsert={setSelectedFileInfo}>
                    <Entry />
                </Exchange>
            </DialogContent>
            <DialogActions classes={{ root: classes.actions }}>
                <Button
                    variant="contained"
                    classes={{ root: classes.button }}
                    onClick={onInsert}
                    disabled={isNil(selectedFileInfo)}>
                    {t.on_insert()}
                </Button>
            </DialogActions>
        </MaskDialog>
    )
}

export default FileServiceDialog
