import { config } from "dotenv";
import { getArrStringFromEnv, getBooleanFromEnv, getEnvString, getIntFromEnv } from "./lib/config.helper";

const path = ".env"
console.table({ env_path: path })
config({ path })

//Common
export const NODE_ENV = getEnvString("NODE_ENV")
export const SERVER_NAME = getEnvString("SERVER_NAME")
export const SENTRY_DNS = getEnvString("SENTRY_DNS")
export const SERVER_CODE = getEnvString("SERVER_CODE")

//Mongo
export const MONGO_URI = getEnvString("MONGO_URI")
export const MONGO_DB_NAME = getEnvString("MONGO_DB_NAME")

//Redis
export const REDIS_URI = getEnvString("REDIS_URI")
export const REDIS_PREFIX = getEnvString("REDIS_PREFIX")
export const REDIS_DB_NUMBER = getIntFromEnv("REDIS_DB_NUMBER")

//Telegram
export const ENABLE_TELEGRAM = getBooleanFromEnv("ENABLE_TELEGRAM")
export const TELEGRAM_BOT_TOKEN = getEnvString("TELEGRAM_BOT_TOKEN")
export const TELEGRAM_BOT_NAME = getEnvString("TELEGRAM_BOT_NAME")
export const LINK_DAPP_TELEGRAM = getEnvString("LINK_DAPP_TELEGRAM")
export const TG_BOT_IS_USE_LOCAL_TELEGRAM = getBooleanFromEnv("TG_BOT_IS_USE_LOCAL_TELEGRAM")
export const TG_BOT_IS_USE_WEBHOOK = getBooleanFromEnv("TG_BOT_IS_USE_WEBHOOK")
export const TG_BOT_WEBHOOK_URL = getEnvString("TG_BOT_WEBHOOK_URL")
export const TG_BOT_WEBHOOK_PORT = getIntFromEnv("TG_BOT_WEBHOOK_PORT")
export const TG_BOT_LOCAL_TELEGRAM_URL = getEnvString("TG_BOT_LOCAL_TELEGRAM_URL")

//Other
export const IS_FORK = getBooleanFromEnv("IS_FORK")
export const IS_DEBUG = getBooleanFromEnv("IS_DEBUG")
export const DEBUG_LEVEL = getArrStringFromEnv("DEBUG_LEVEL", ",")
export const ADMIN_KEY = getEnvString("ADMIN_KEY")


//Check enviroment
export let isProductionRun = ["prod", "production"].includes(NODE_ENV)
export let isLocalRun = ["local"].includes(NODE_ENV)