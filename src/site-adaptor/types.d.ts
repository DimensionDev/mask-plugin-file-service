declare module 'mask://self' {
    export type RPCType = typeof import('../worker/service')
    export type GeneratorRPC = typeof import('../worker/service')
}
