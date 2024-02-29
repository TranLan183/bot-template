import { MILLISECOND_PER_ONE_SEC } from "./constants";
import { timeSystem } from "./time_sys";

class CLocalCacheArray<T> {
    private _cache = new Array<T & { lock_to: Date }>();
    private _value_lifetime_in_sec: number
    constructor(value_lifetime_in_sec: number) {
        this._value_lifetime_in_sec = value_lifetime_in_sec
    }
    push = (value: T, life_time_sec?: number) => {
        this._cache.push({ ...value, lock_to: timeSystem.getDateInFuture(new Date(), { seconds: life_time_sec || this._value_lifetime_in_sec }) })
    }
    getAll = () => {
        this._cache = this._cache.filter(el => el.lock_to > new Date())
        return this._cache
    }
}

class CLocalLoadCacheMap<T> {
    private _cache = new Map<string, { data: T, lock_to: number }>();
    private _value_lifetime_in_sec: number
    private _reload_value_callback: (key: string) => Promise<T>
    constructor(value_lifetime_in_sec: number, reload_key_callback: (key: string) => Promise<T>) {
        this._value_lifetime_in_sec = value_lifetime_in_sec
        this._reload_value_callback = reload_key_callback
    }
    reload = async (key: string) => {
        const value = await this._reload_value_callback(key)
        const new_value = this.set(key, value)
        return new_value
    }
    set = (key: string, value: T) => {
        const new_value = { data: value, lock_to: +timeSystem.getDateInFuture(new Date(), { seconds: this._value_lifetime_in_sec }) }
        this._cache.set(key, new_value)
        return new_value

    }
    get = async (key: string) => {
        let value: { data: T, lock_to: number } | undefined = this._cache.get(key)
        if (!value || (+new Date() > (value.lock_to + this._value_lifetime_in_sec * MILLISECOND_PER_ONE_SEC))) {
            value = await this.reload(key)
            return value
        }
        if (+new Date() > value.lock_to) {
            this.reload(key)
            return value
        }
        return value
    }
}

class CLocalCacheMap<T> {
    private _cache = new Map<string, { data: T, lock_to: number }>();
    private _value_lifetime_in_sec: number
    constructor(value_lifetime_in_sec: number) {
        this._value_lifetime_in_sec = value_lifetime_in_sec
    }

    sets(keys: string[], values: T[]) {
        for (let i = 0; i < keys.length; i++) {
            const value = values[i]
            const key = keys[i]
            const new_value = { data: value, lock_to: +timeSystem.getDateInFuture(new Date(), { seconds: this._value_lifetime_in_sec }) }
            this._cache.set(key, new_value)
        }

    }

    gets(keys: string[]) {
        this.clear()
        return keys.map(key => {
            const item = this._cache.get(key)
            if (item && item.lock_to < +new Date()) {
                this._cache.delete(key)
                return undefined
            }
            return item?.data
        }
        )
    }

    clear() {
        this._cache.forEach((value, key) => {
            if (value.lock_to < +new Date()) {
                this._cache.delete(key)
            }
        })
    }

    size(){
        return this._cache.size
    }
}

export {
    CLocalCacheArray,
    CLocalLoadCacheMap,
    CLocalCacheMap
}