import { type FileInfo, type FileInfoV1, Provider } from './types.js'
import { isNil } from 'lodash-unified'
import { encodeArrayBuffer, encodeText } from '@dimensiondev/kit'
export function FileInfoV1ToV2(info: FileInfoV1): FileInfo {
    return { ...info, type: 'file', provider: 'arweave' as Provider }
}

export async function makeFileKeySigned(fileKey: string | undefined | null) {
    if (isNil(fileKey)) {
        return null
    }
    const encodedKey = encodeText(fileKey)
    const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: { name: 'SHA-256' } }, true, ['sign', 'verify'])
    const exportedKey = await crypto.subtle.exportKey('raw', key)
    const signed = await crypto.subtle.sign({ name: 'HMAC' }, key, encodedKey)
    return [signed, exportedKey].map((e) => encodeArrayBuffer(new Uint8Array(e)))
}

export const resolveGatewayAPI = (provider: Provider) => {
    return {
        [Provider.arweave]: 'https://arweave.net',
        [Provider.ipfs]: 'https://mask.infura-ipfs.io/ipfs',
        [Provider.swarm]: 'https://gateway-proxy-bee-6-0.gateway.ethswarm.org/bzz',
    }[provider]
}
