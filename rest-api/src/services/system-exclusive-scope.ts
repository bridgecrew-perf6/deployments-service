import NamedMutex from 'named-mutex';

export type AsyncScope = () => Promise<void>;

/**
 * Creates monitored async scope (just a parameterless async void function) which
 * will not in parallel with other scopes of the same namespace.
 */
export default function(namespace: string, body: AsyncScope): AsyncScope {
    const mutex = new NamedMutex(namespace);
    
    return async function() {
        await mutex.lock();
        await body();
        mutex.unLock();
    }
}