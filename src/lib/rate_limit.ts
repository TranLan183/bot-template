import Redis from "ioredis";
var crypto = require('crypto');

export class RateLimitController {
    constructor(private _redis: Redis, private _error: Error) {
        if (!_redis) throw new Error("RateLimitController: redis instance must be provided!")
        if (!_error) throw new Error("RateLimitController: error message must be provided!")
    }

    CreateKey(api_name: string, ...params: string[]) {
        var name = api_name + "_" + params.join("_");
        var hash = crypto.createHash('md5').update(name).digest('hex');
        return hash
    }

    async CheckRateLimit(key: string, rate_limit: number, window_time_second: 1 | 2 | 60 | 600 | 3600 | 86400) {
        const now = +new Date()
        const frame = Math.floor(now / (window_time_second * 1000))
        const count = await this._redis.incr(key + "_" + frame)
        if (count === 1) {
            await this._redis.expireat(key, (frame + 1) * window_time_second)
        } else if (count > rate_limit) {
            throw this._error
        }
        return count
    }
}

