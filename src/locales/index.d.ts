// TODO: use i18n codegen to generate this automatically
declare module 'mask://self' {
    export type OwnedTranslation = typeof import('./en-US.json')
    export type OwnedTranslationInterop = typeof import('./en-US.json')
}
