import NamedMutex from 'named-mutex';

export type AsyncScope = () => Promise<void>;

export default function(namespace: string, body: AsyncScope): AsyncScope {
    const mutex = new NamedMutex(namespace);
    
    return async function() {
        await mutex.lock();
        await body();
        mutex.unLock();
    }
}