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
export const TELEGRAM_GAME_NAME = getEnvString("TELEGRAM_GAME_NAME")
export const TELEGRAM_IMAGE_BACKGROUND = 'https://res.cloudinary.com/dfxltugeh/image/upload/v1704884542/t-dragon/tele_vscyvj.png'

//Other
export const IS_FORK = getBooleanFromEnv("IS_FORK")
export const IS_DEBUG = getBooleanFromEnv("IS_DEBUG")
export const DEBUG_LEVEL = getArrStringFromEnv("DEBUG_LEVEL", ",")
export const ADMIN_KEY = getEnvString("ADMIN_KEY")


//Check enviroment
export let isProductionRun = ["prod", "production"].includes(NODE_ENV)
export let isLocalRun = ["local"].includes(NODE_ENV)