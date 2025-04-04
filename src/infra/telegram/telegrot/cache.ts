
class TelegramCacheService<GCache> {
    private localCache: Map<string, GCache>;
    private DEFAULT_KEY_DATA_USER_CACHE = "DATA_USER_CACHE"
    private bot_name: string

    private constructor(bot_name: string) {
        this.bot_name = bot_name
        this.localCache = new Map<string, GCache>();
    }

    private createCacheKey = (userId: string): string => {
        return `${this.bot_name}.${this.DEFAULT_KEY_DATA_USER_CACHE}_${userId}`;
    }

    public getDataUserCache = (userId: string): GCache | null => {
        const key = this.createCacheKey(userId);
        return this.localCache.get(key) || null;
    }

    public setDataUserCache = (userId: string, data: Partial<GCache>): void => {
        const key = this.createCacheKey(userId);
        const existingData = this.localCache.get(key) || data;
        const updatedData = { ...existingData, ...data };
        this.localCache.set(key, updatedData as GCache);
    }

    public delDataUserCache = (userId: string, fields?: (keyof GCache)[]): void => {
        const key = this.createCacheKey(userId);
        if (fields) {
            const existingData = this.localCache.get(key);
            if (existingData) {
                fields.forEach(field => delete existingData[field]);
                this.localCache.set(userId, existingData);
            }
        } else {
            this.localCache.delete(key);
        }
    }

    // public handldDefaultCacheUserSetting = async (userId: string) => {
    //     const dataUserSetting: TCacheDataUser = {
    //         user_step: 'finish', language: 'en',
    //     }
    //     await this.setDataUserCache(userId, dataUserSetting)
    //     return dataUserSetting
    // }

    // public isCacheUserSettingFieldsMissing = (dataUserSetting: GCache) => {
    //     const arrFieldUserSetting: (keyof GCache)[] = [
    //         "user_step", "language"
    //     ]
    //     return arrFieldUserSetting.some(key => dataUserSetting[key] === undefined)
    // }
}

export {
    TelegramCacheService
}