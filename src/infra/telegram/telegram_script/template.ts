import { ITelegramBotTemplate, TDefaultReplyMarkup, TFileTemplate, TTemplateLanguage, TTemplateMessageConfig } from './type';

enum EFlag {
    '🇬🇧' = 'en',
    '🇨🇳' = 'zh',
    '🇷🇺' = 'ru',
    '🇻🇳' = 'vi',
    '🇫🇷' = 'fr',
    '🇮🇩' = 'id'
}

const defaultTemplateData = {
    "welcome": "Welcome to the bot",
    "unknown_command": "❌ Unknown Command!\n\nYou have sent a Message directly into the Bot's chat or Menu structure has been modified by Admin.\nℹ️ Do not send Messages directly to the Bot or reload the Menu by pressing /start",
    "error": "ℹ️ Something went wrong, please /start again!",
    "server_maintain": "Server maintain. We will come back soon",
    "waiting_bot": "🤖 Thanks for waiting, bot is available now!",
    "full_description": "full_description",
    "short_description": "short_description"
}

class TelegramBotTemplate<GTemplate> implements ITelegramBotTemplate<GTemplate> {
    public default_language: TTemplateLanguage = 'en'
    public _file_template: TFileTemplate | object = new Object()
    private default_template_data = defaultTemplateData
    constructor(file_template: TFileTemplate, default_language?: TTemplateLanguage) {
        this.default_language = default_language || this.default_language
        this._file_template = file_template
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

    template_message = (parameters: TTemplateMessageConfig<GTemplate>) => {
        const { template, args, language = this.default_language } = parameters
        let message: string = this._file_template[language][template] || this._file_template[this.default_language][template] || this.default_template_data[template as unknown as string]
        if (!args) return message
        Object.keys(args).forEach(key => {
            const replaceMessage = message.replaceAll(`{{${key}}}`, args[key])
            if (replaceMessage) message = replaceMessage
        })
        return message
    }

    default_reply_markup = {
        force_reply: () => {
            return {
                force_reply: true
            }
        },
    } as TDefaultReplyMarkup
}

export {
    EFlag, TelegramBotTemplate
};

