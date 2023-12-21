declare module 'redux-persist-indexeddb-storage' {
    import type { Storage } from 'redux-persist'

    const storage: (name: string) => Storage

    export default storage
}