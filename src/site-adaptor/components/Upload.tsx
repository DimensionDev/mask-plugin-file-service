import { Attachment } from '@dimensiondev/common-protocols'
import { encodeArrayBuffer } from '@dimensiondev/kit'
import { Checkbox, Radio, FormControlLabel, Link, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import { isNil } from 'lodash-unified'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsync } from 'react-use'
import { worker as PluginFileServiceRPC } from '@masknet/plugin'
import { useI18N, Translate } from '@masknet/plugin-hooks'
import { makeFileKey } from '../../shared/file-key.js'
import type { ProviderConfig } from '../../shared/types.js'
import { FileRouter, MAX_FILE_SIZE } from '../../shared/constants.js'
import { RecentFiles } from './RecentFiles.js'
import { UploadDropArea } from './UploadDropArea.js'
import { Provider } from '../../shared/types.js'

const useStyles = makeStyles()((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    upload: {
        flex: 1,
        display: 'flex',
    },
    legal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'fit-content',
    },
    checkItems: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: 'fit-content',
    },
    encrypted: {
        userSelect: 'none',
        '& span': { fontSize: 12, lineHeight: 1.75 },
    },
    usedCDN: {
        userSelect: 'none',
        '& span': { fontSize: 12, lineHeight: 1.75 },
    },
    legalText: {
        userSelect: 'none',
        fontSize: 12,
        lineHeight: 1.75,
        color: theme.palette.text.secondary,
        '& a': { textDecoration: 'none' },
    },
}))

export function Upload() {
    const t = useI18N()
    const { classes } = useStyles()
    const navigate = useNavigate()
    const [encrypted, setEncrypted] = useState(true)
    const [useCDN, setUseCDN] = useState(false)
    const [provider, setProvider] = useState<Provider>(Provider.arweave)
    const recent = useAsync(() => PluginFileServiceRPC.getRecentFiles(), [])
    const allProviders: ProviderConfig[] = [
        {
            provider: Provider.arweave,
            name: t.provider_arweave(),
        },
        {
            provider: Provider.ipfs,
            name: t.provider_ipfs(),
        },
        {
            provider: Provider.swarm,
            name: t.provider_swarm(),
        },
    ]

    const onFile = async (file: File) => {
        let key: string | undefined = undefined
        if (encrypted) {
            key = makeFileKey()
        }
        const block = new Uint8Array(await file.arrayBuffer())
        const checksum = encodeArrayBuffer(await Attachment.checksum(block))
        const item = await PluginFileServiceRPC.getFileInfo(checksum)
        if (isNil(item)) {
            navigate(FileRouter.uploading, {
                state: {
                    key,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    block,
                    checksum,
                    useCDN,
                    provider,
                },
            })
        } else {
            navigate(FileRouter.uploaded, { state: item })
        }
    }

    const allProviderOptions = allProviders.map((config: ProviderConfig) => (
        <FormControlLabel
            key={config.provider}
            control={
                <Radio
                    color="primary"
                    checked={provider === config.provider}
                    onChange={() => setProvider(config.provider)}
                />
            }
            className={classes.encrypted}
            label={config.name}
        />
    ))

    const cdnButton =
        provider === Provider.arweave ? (
            <FormControlLabel
                control={
                    // @ts-expect-error
                    <Checkbox color="primary" checked={useCDN} onChange={(event) => setUseCDN(event.target.checked)} />
                }
                className={classes.usedCDN}
                label={t.use_cdn()}
            />
        ) : null

    return (
        <section className={classes.container}>
            <section className={classes.upload}>
                <UploadDropArea maxFileSize={MAX_FILE_SIZE} onFile={onFile} />
                <RecentFiles files={recent.value ?? []} />
            </section>
            <section className={classes.checkItems}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={encrypted}
                            // @ts-expect-error
                            onChange={(event) => setEncrypted(event.target.checked)}
                        />
                    }
                    className={classes.encrypted}
                    label={t.on_encrypt_it()}
                />
                {cdnButton}
            </section>
            <section className={classes.checkItems}>{allProviderOptions}</section>
            <section className={classes.legal}>
                <Typography className={classes.legalText}>
                    <Translate.legal_text
                        components={{
                            terms: <Link target="_blank" href={t.legal_terms_link()} />,
                            policy: <Link target="_blank" href={t.legal_policy_link()} />,
                        }}
                    />
                </Typography>
            </section>
        </section>
    )
}
