import { getArrStringFromEnv } from "../../../lib/config.helper"


// const service = async () => {
//     const TELEGRAM_AGENCY_BOT_TOKENS = getArrStringFromEnv("TELEGRAM_AGENCY_BOT_TOKENS", ",")
//     const TELEGRAM_AGENCY_BOT_NAMES = getArrStringFromEnv("TELEGRAM_AGENCY_BOT_NAMES", ",")
//     const AGENCY_ADDRESS = getArrStringFromEnv("AGENCY_ADDRESS", ",")
//     console.log({TELEGRAM_AGENCY_BOT_TOKENS,TELEGRAM_AGENCY_BOT_NAMES,AGENCY_ADDRESS})
//     const INDEX = 1
//     if (!TELEGRAM_AGENCY_BOT_TOKENS[INDEX] || !TELEGRAM_AGENCY_BOT_NAMES[INDEX] || !AGENCY_ADDRESS[INDEX]) throw new Error("Agency not found!")
//     await Promise.all([
//         connectMongo(MONGO_URI, MONGO_DB_NAME),
//         initSentry(),
//         initRedis(REDIS_DB_NUMBER),
//         connectTronWeb(),
//     ])
//     setPendingOrderPaymentSystem(mongo, MONGO_DB_NAME, PENDING_ORDER_PAYMENT_MNEMONIC)
//     await initTelegramAgencyBot({
//         bot_token: TELEGRAM_AGENCY_BOT_TOKENS[INDEX],
//         bot_name: TELEGRAM_AGENCY_BOT_NAMES[INDEX],
//         link_address: AGENCY_ADDRESS[INDEX],
//         agency_id: "agent_2",
//         default_language: 'en'
//     })
// }

// service()