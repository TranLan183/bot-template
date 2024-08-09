import en from '../telegram_template/en.json';
import ru from '../telegram_template/ru.json';
import scan_bot_en from '../telegram_template/scan_bot.en.json';
import zh from '../telegram_template/zh.json';
import vi from '../telegram_template/vi.json';
import fr from '../telegram_template/fr.json';
import id from '../telegram_template/id.json';
import buy_noti_bot_en from '../telegram_template/buy_noti_bot.en.json';
import { ITelegramBotTemplate, TTemplateLanguage, TTemplateMessageConfig } from './type';

const file_template = {
    en,
    scan_bot_en,
    zh,
    ru,
    vi,
    fr,
    id,
    buy_noti_bot_en
}

enum EFlag {
    '🇬🇧' = 'en',
    '🇨🇳' = 'zh',
    '🇷🇺' = 'ru',
    '🇻🇳' = 'vi',
    '🇫🇷' = 'fr',
    '🇮🇩' = 'id'
}

class TelegramBotTemplate implements ITelegramBotTemplate {
    public _bot_id: string | undefined
    public default_language: TTemplateLanguage = 'en'
    constructor(bot_id?: string, default_language?: TTemplateLanguage) {
        this._bot_id = bot_id
        this.default_language = default_language || this.default_language
    }

    message_entities = {
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
        const { template, bot_id = this._bot_id, args, language = this.default_language } = parameters
        let message: string = file_template[`${bot_id}_${language}`]?.[template] || file_template[language][template] || file_template[this.default_language][template]
        if (!args) return message
        Object.keys(args).forEach(key => {
            const replaceMessage = message.replaceAll(`{{${key}}}`, args[key])
            if (replaceMessage) message = replaceMessage
        })
        return message
    }
}

export {
    EFlag, TelegramBotTemplate, file_template
};
