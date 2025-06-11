import { ICache } from "./type";

export class LocalMapCache implements ICache {
    private localCache = new Map<string, any>();

    get<T>(key: string): T | undefined {
        return this.localCache.get(key) as T | undefined;
    }

    set<T>(key: string, value: T): void {
        this.localCache.set(key, value);
    }

    delete(key: string): void {
        this.localCache.delete(key)
    }
}