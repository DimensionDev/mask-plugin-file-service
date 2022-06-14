import { formatFileSize } from '@dimensiondev/kit'
import { addMetadataRender, addMetadataBadgeRender, addCompositionEntry } from '@masknet/plugin/content-script'
import { truncate } from 'lodash-unified'
import { FileInfoV1ToV2 } from '../shared/helpers.js'
import type { FileInfo, FileInfoV1 } from '../shared/types.js'
import FileServiceDialog from './MainDialog.js'
import { Preview } from './Preview.js'
import { FileServiceIcon } from '@masknet/icons'

addMetadataRender('1', (meta: FileInfoV1) => <Preview info={FileInfoV1ToV2(meta)} />)
addMetadataRender('2', (meta: FileInfo) => <Preview info={meta} />)
addMetadataBadgeRender('2', (meta: FileInfo) => onAttachedFile(meta))
addCompositionEntry(
    <>
        <FileServiceIcon style={{ width: 16, height: 16 }} />
        File Service
    </>,
    FileServiceDialog,
)

// TODO: how to handle this?
// wrapperProps: {
//     icon: (
//         <FileServiceIcon
//             style={{ width: 24, height: 24, filter: 'drop-shadow(0px 6px 12px rgba(247, 147, 30, 0.2))' }}
//         />
//     ),
//     backgroundGradient:
//         'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(28, 104, 243, 0.2) 0%, rgba(255, 177, 16, 0.2) 100%), #FFFFFF;',
// },

function onAttachedFile(payload: FileInfo) {
    const name = truncate(payload.name, { length: 10 })
    return {
        text: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileServiceIcon style={{ width: 16, height: 16 }} />
                Attached File: {name} ({formatFileSize(payload.size)})
            </div>
        ),
    }
}
