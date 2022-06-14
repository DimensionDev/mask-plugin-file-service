import { addBackupHandler } from '@masknet/plugin/worker'
import { None, Result, Some } from 'ts-results'
import type { FileInfo } from '../shared/types.js'
import { getAllFiles, setFileInfo } from './database.js'

addBackupHandler({
    async onBackup() {
        const files = await getAllFiles()
        const result = files?.length ? new Some(files) : None

        return result
    },
    async onRestore(files: FileInfo[]) {
        return Result.wrap(() => {
            files.map(async (file) => {
                file.createdAt = new Date(file.createdAt)
                await setFileInfo(file)
            })
        })
    },
})
