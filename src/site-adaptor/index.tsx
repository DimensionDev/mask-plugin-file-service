import { formatFileSize } from '@dimensiondev/kit'
import { addMetadataRender, addMetadataBadgeRender, addCompositionEntry } from '@masknet/plugin/content-script'
import { truncate } from 'lodash-unified'
import { FileInfoV1ToV2 } from '../shared/helpers.js'
import type { FileInfo, FileInfoV1 } from '../shared/types.js'
import FileServiceDialog from './MainDialog.js'
import { Preview } from './Preview.js'
import { Icons } from '@masknet/icons'

addMetadataRender('1', (meta: FileInfoV1) => <Preview info={FileInfoV1ToV2(meta)} />)
addMetadataRender('2', (meta: FileInfo) => <Preview info={meta} />)
addMetadataBadgeRender('2', (meta: FileInfo) => onAttachedFile(meta))
addCompositionEntry(
    <>
        <Icons.FileService size={16} />
        File Service
    </>,
    FileServiceDialog,
)

function onAttachedFile(payload: FileInfo) {
    const name = truncate(payload.name, { length: 10 })
    return {
        text: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icons.FileService size={16} />
                Attached File: {name} ({formatFileSize(payload.size)})
            </div>
        ),
    }
}
