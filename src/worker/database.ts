import { FileInfoV1ToV2 } from '../shared/helpers.js'
import type { FileInfo } from '../shared/types.js'
import { taggedStorage } from '@masknet/plugin/worker'

let migrationDone = false
async function migrationV1_V2() {
    if (migrationDone) return
    for await (const cursor of taggedStorage.iterate_mutate('arweave')) {
        await taggedStorage.add(FileInfoV1ToV2(cursor.value))
        await cursor.delete()
    }
    migrationDone = true
}

export async function getAllFiles() {
    await migrationV1_V2()
    const files: FileInfo[] = []
    for await (const { value } of taggedStorage.iterate('file')) {
        files.push(value)
    }
    return files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getRecentFiles() {
    const files = await getAllFiles()
    return files.slice(0, 4)
}

export async function getFileInfo(checksum: string) {
    await migrationV1_V2()
    return taggedStorage.get('file', checksum)
}

export async function setFileInfo(info: FileInfo) {
    await migrationV1_V2()
    return taggedStorage.add(info)
}
