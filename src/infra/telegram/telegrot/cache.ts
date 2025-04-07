import { ITelegramCache } from './type'

class TelegramCacheService<GCache> implements ITelegramCache<GCache> {
    private localCache: Map<string, GCache>;
    private DEFAULT_KEY_DATA_USER_CACHE = "DATA_USER_CACHE"
    private bot_name: string

    constructor(bot_name: string) {
        this.bot_name = bot_name
        this.localCache = new Map<string, GCache>();
    }

    createCacheKey = (userId: string): string => {
        return `${this.bot_name}.${this.DEFAULT_KEY_DATA_USER_CACHE}_${userId}`;
    }

    getDataUserCache(userId: string): Promise<GCache | null>  {
        return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.localCache.get(userId) || null);
            }, 0);
        });
    }

    setDataUserCache(userId: string, data: Partial<GCache>): Promise<void> {
        return new Promise((resolve, reject)=> {
            setTimeout(() => {
                try {
                    const key = this.createCacheKey(userId);
                    const existingData = this.localCache.get(key) || data;
                    const updatedData = { ...existingData, ...data };
                    this.localCache.set(key, updatedData as GCache)
                    resolve()
                } catch (error) {
                    reject(error);
                }
            }, 0)
        })
    }

    delDataUserCache(userId: string, fields?: (keyof GCache)[]): Promise<void> {
        return new Promise((resolve,reject) => {
            setTimeout(()=> {
                try {
                    const key = this.createCacheKey(userId);
                    const existingData = this.localCache.get(key);
                    if (existingData) {
                        if (fields) {
                            fields.forEach(field => delete existingData[field]);
                            this.localCache.set(userId, existingData);
                        } else {
                            this.localCache.delete(key);
                        }
                    }
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }) 
        })
    }
}

export {
    TelegramCacheService
}