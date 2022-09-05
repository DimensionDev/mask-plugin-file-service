import { formatFileSize } from '@dimensiondev/kit'
import {
    registerMetadataRender,
    registerMetadataBadgeRender,
    registerCompositionEntry,
} from '@masknet/plugin/content-script/react'
import { truncate } from 'lodash-unified'
import { FileInfoV1ToV2 } from '../shared/helpers.js'
import type { FileInfo, FileInfoV1 } from '../shared/types.js'
import FileServiceDialog from './MainDialog.js'
import { Preview } from './Preview.js'
import { Icons } from '@masknet/icons'

registerMetadataRender('1', (meta: FileInfoV1) => <Preview info={FileInfoV1ToV2(meta)} />)
registerMetadataRender('2', (meta: FileInfo) => <Preview info={meta} />)
registerMetadataBadgeRender('2', (meta: FileInfo) => onAttachedFile(meta))
registerCompositionEntry(
    <>
        <Icons.FileService size={16} />
        File Service
    </>,
    FileServiceDialog,
)

function onAttachedFile(payload: FileInfo) {
    const name = truncate(payload.name, { length: 10 })
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icons.FileService size={16} />
            Attached File: {name} ({formatFileSize(payload.size)})
        </div>
    )
}
