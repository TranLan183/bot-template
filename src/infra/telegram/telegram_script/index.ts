import { TBotTelegram } from '../telegram.type';
import en from '../telegram_template/en.json';
import { ReplyMarkup, TTemplateLanguage, TTemplateMessageConfig } from './type';

const file_template = {
    en,
}

enum EFlag {
    '🇬🇧' = 'en',
}

class TelegramBotScript {
    private default_language: TTemplateLanguage = 'en'

    private callback_data = {

    }
    private _bot_tele: TBotTelegram
    private _bot_id?: string 
    constructor (params: { bot_tele: TBotTelegram, bot_id?: string }) {
        const { bot_tele, bot_id } = params
        this._bot_tele = bot_tele
        this._bot_id = bot_id
    }
    reply_markup = (language: TTemplateLanguage = this.default_language): ReplyMarkup => {
        const dataReplyMarkup: ReplyMarkup = {
            welcome: {
                resize_keyboard: true,
                force_reply: true,
                // inline_keyboard: [
                //     [{ text: 'test', callback_data: 'test' }]
                // ],
                // one_time_keyboard: true,
                // keyboard: [[]],
            },
        }
        return dataReplyMarkup
    }

    entities_message = {
        setBoldMessage: (message: string) => '*' + message + '*',
        setItalicMessage: (message: string) => '_' + message + '_',
        setCodeMessage: (message: string) => '`' + message + '`', // text blue
        setMonoSpaceMessage: (message: string) => '```' + message + '```',
        setUnderlineMessage: (message: string) => '__' + message + '__',
        setSpoilerMessage: (message: string) => '||' + message + '||',
        setStrikeMessage: (message: string) => '~' + message + '~',
        setTextUrlMessage: (message: string, url: string, to_short: boolean = false) => {
            const covertMessage = to_short ? message.replace(message.slice(4, message.length - 4), '...') : message
            return '[' + covertMessage + ']' + '(' + url + ')'
        }
    }

    template_message = (parameters: TTemplateMessageConfig) => {
        const { template, args, language = this.default_language } = parameters
        let message: string = file_template[`${ this._bot_id }_${ language }`]?.[template] || file_template[language][template]
        if (!args) return message
        Object.keys(args).forEach(key => {
            message = message.replace(`{{${key}}}`, args[key])
        })
        return message
    }
}

export {
    file_template,
    EFlag,
}