import { TTelegramBot } from "../../telegrot"
import { TeleConfigBotAgency } from "./config_bot"
import en from "./telegram_language/en.json"
import { AgencyReplyMarkup } from "./type"

const file_template = {
    en
}

let agency_bot: TTelegramBot<AgencyReplyMarkup, TTemplateAgency>

type TTemplateAgency = keyof typeof file_template.en

type InitBotAgencyParams = {
    bot_name: string
    bot_token: string
    is_enable: boolean
}

const initBotAgency = async (params: InitBotAgencyParams) => {
    const { bot_name, bot_token, is_enable } = params
    agency_bot = new TTelegramBot({
        bot_name,
        bot_token,
        is_enable,
        bot_error_list: [],
        bot_config: new TeleConfigBotAgency(file_template)
    }, {
        is_use_local_telegram: false,
        is_use_webhook: false,
        delay_bot_start: 0,
    }, () => {
       
    })
    agency_bot.init()
}

export {
    initBotAgency,
    TTemplateAgency
}
