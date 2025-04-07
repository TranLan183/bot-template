import { Telegraf } from 'telegraf';
import { ELifetime, IEntitiesMessage, ITelegramConfig, TBotTelegram, TFileTemplate, TOptionEditMessage, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto, TTemplateLanguage, TTemplateMessageConfig, ITelegramCache} from './type';
import { BotCommand, BotCommandScope, InlineKeyboardMarkup } from 'telegraf/types';
import { MILLISECOND_PER_ONE_SEC } from '../../../lib/constants';

class TelegramBotScript<GReplyMarkup, GTemplate, GCache>  {

    public bot_tele: TBotTelegram
    public default_language: TTemplateLanguage;
    public file_template: TFileTemplate
    public entities_message: IEntitiesMessage
    public template_message: (parameters: TTemplateMessageConfig<GTemplate>) => string
    public reply_markup: (language?: TTemplateLanguage) => GReplyMarkup
    public all_commands: (language?: TTemplateLanguage) => BotCommand[]
    public user_setting: ITelegramCache<GCache>

    constructor(bot_tele: Telegraf, configBot: ITelegramConfig<GReplyMarkup, GTemplate, GCache>) {
        this.bot_tele = bot_tele
        this.template_message = configBot.template.template_message
        this.entities_message = configBot.template.entities_message
        this.reply_markup = configBot.template.reply_markup
        this.all_commands = configBot.template.all_commands
        this.default_language = configBot.template.default_language
        this.file_template = configBot.template.file_template
        this.user_setting = configBot.cache
    }


    private setLifeTime = (chat_id: string | number, message_id: number, life_time: ELifetime) => {
        let result_lifetime_num: number = 0
        switch (life_time) {
            case 'long':
                result_lifetime_num = 30
                break;
            case 'medium':
                result_lifetime_num = 15
                break;
            case 'short':
                result_lifetime_num = 5
                break;
            default:
                result_lifetime_num = life_time
                break;
        }
        setTimeout(() => this.deleteMessage(chat_id, message_id), result_lifetime_num * MILLISECOND_PER_ONE_SEC);
    }

    sendMessage = async (chat_id: string | number, options: TOptionSendMessage<GTemplate>) => {
        const { template, language, parse_mode, reply_markup, args, message_id, life_time, callback } = options
        const resultMessage = await this.bot_tele.telegram.sendMessage(chat_id, this.template_message(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.reply_markup(language)['force_reply']() : reply_markup : undefined,
            reply_parameters: message_id ? { message_id } : undefined,
        });
        if (life_time) this.setLifeTime(chat_id, resultMessage.message_id, life_time)
        callback && callback(resultMessage);
        return resultMessage;
    }

    sendAnswerCbQuery = (callbackQueryId: string, options: TOptionSendAnswerCbQuery<GTemplate>) => {
        return this.bot_tele.telegram.answerCbQuery(callbackQueryId, this.template_message(options), options)
    }

    sendBufferPhoto = async (chat_id: string | number, options: TOptionSendBufferPhoto<GTemplate>) => {
        const { life_time, source, reply_markup, callback, language, template, args } = options
        const img_msg_data = await this.bot_tele.telegram.sendPhoto(chat_id,
            {
                source,
            },
            {
                caption: this.template_message(options) + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.reply_markup(language)['force_reply']() : reply_markup : undefined,
            }
        );
        if (life_time) this.setLifeTime(chat_id, img_msg_data.message_id, life_time)
        callback && callback(img_msg_data);
        return img_msg_data
    }

    sendUrlPhoto = async (chat_id: string | number, options: TOptionSendUrlPhoto<GTemplate>) => {
        const { life_time, url, reply_markup, callback, language, template, args } = options
        const img_msg_data = await this.bot_tele.telegram.sendPhoto(chat_id,
            {
                url,
            },
            {
                caption: this.template_message(options) + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.reply_markup(language)['force_reply']() : reply_markup : undefined
            }
        );
        if (life_time) this.setLifeTime(chat_id, img_msg_data.message_id, life_time)
        callback && callback(img_msg_data);
        return img_msg_data
    }

    editMessage = (chat_id: string | number, message_id: number, options: TOptionEditMessage<GTemplate>) => {
        const { template, language, parse_mode, reply_markup, args, life_time, callback } = options
        const resultEditMessage = this.bot_tele.telegram.editMessageText(chat_id, message_id, undefined, this.template_message(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.reply_markup(language)['force_reply']() : reply_markup : undefined
        })
        if (life_time) this.setLifeTime(chat_id, message_id, life_time)
        callback && callback(resultEditMessage);
        return resultEditMessage
    }

    editMessageReplyMarkup = async (chat_id: string | number, message_id: number, markup: InlineKeyboardMarkup) => {
        return this.bot_tele.telegram.editMessageReplyMarkup(chat_id, message_id, undefined, markup).catch((err) => console.log(err))
    }

    editMessageCaption = (chat_id: string | number, message_id: number, options: TOptionSendMessage<GTemplate>) => {
        const { template, language, parse_mode, reply_markup, args, life_time, callback } = options
        const resultEditMessageCaption = this.bot_tele.telegram.editMessageCaption(chat_id, message_id, undefined, this.template_message(options), {
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.reply_markup(language)['force_reply']() : reply_markup : undefined
        }).catch((err) => console.log(err))
        if (life_time) this.setLifeTime(chat_id, message_id, life_time)
        callback && callback(resultEditMessageCaption);
        return resultEditMessageCaption
    }

    deleteMessage = async (chat_id: string | number, message_id: number) => {
        return this.bot_tele.telegram.deleteMessage(chat_id, message_id).catch(err => console.log(err))
    }

    setCommands = (data_command: BotCommand[], scope?: BotCommandScope) => {
        const commandScope = scope ? { scope } : undefined
        this.bot_tele.telegram.setMyCommands(data_command, commandScope)
    }

    setDescription = (params: TTemplateMessageConfig<GTemplate>) => {
        return this.bot_tele.telegram.setMyDescription(this.template_message(params))
    }

    setShortDescription = (params: TTemplateMessageConfig<GTemplate>) => {
        return this.bot_tele.telegram.setMyShortDescription(this.template_message(params))
    }

    resetCommands = async (new_language: TTemplateLanguage, chatId: number) => {
        await this.bot_tele.telegram.deleteMyCommands({ scope: { type: "chat", chat_id: chatId } })
        const commands = this.all_commands(new_language)
        if (commands.length > 0) this.setCommands(commands, { type: 'chat', chat_id: chatId })
    }
}

export {
    TelegramBotScript
};