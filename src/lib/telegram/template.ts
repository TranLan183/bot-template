import { BotCommand } from 'telegraf/types'
import { IEntitiesMessage, ITelegramBotTemplate, TDefaultReplyMarkup, TFileTemplate, TTemplateLanguage, TTemplateMessageConfig } from './type';

enum EFlag {
    '🇬🇧' = 'en',
    '🇨🇳' = 'zh',
    '🇷🇺' = 'ru',
    '🇻🇳' = 'vi',
    '🇫🇷' = 'fr',
    '🇮🇩' = 'id'
}

const DefaultTemplateData = {
    "welcome": "Welcome to the bot",
    "unknown_command": "❌ Unknown Command!\n\nYou have sent a Message directly into the Bot's chat or Menu structure has been modified by Admin.\nℹ️ Do not send Messages directly to the Bot or reload the Menu by pressing /start",
    "error": "ℹ️ Something went wrong, please /start again!",
    "server_maintain": "Server maintain. We will come back soon",
    "waiting_bot": "🤖 Thanks for waiting, bot is available now!",
    "full_description": "full_description",
    "short_description": "short_description",
    "btn_switch_language": "🇬🇧 English@🇨🇳 中文@🇮🇩 Indonesia",
    "message_table": "{{messageTable}}"
}

class TelegramBotTemplate<GReplyMarkup, GTemplate> implements ITelegramBotTemplate<GReplyMarkup, GTemplate> {
    public default_language: TTemplateLanguage = 'en'
    public file_template: TFileTemplate | object = new Object()

    private default_template_data = DefaultTemplateData
    constructor(_file_template: TFileTemplate, default_language?: TTemplateLanguage) {
        this.default_language = default_language || this.default_language
        this.file_template = _file_template
    }

    entities_message(message: string): IEntitiesMessage {
        return {
            setBoldMessage: () => '*' + message + '*',
            setItalicMessage: () => '_' + message + '_',
            setCodeMessage: () => '`' + message + '`', // text blue
            setMonoSpaceMessage: () => '```' + message + '```',
            setUnderlineMessage: () => '__' + message + '__',
            setSpoilerMessage: () => '||' + message + '||',
            setStrikeMessage: () => '~' + message + '~',
            setTextUrlMessage: (url: string, to_short: boolean = false) => {
                const covertMessage = to_short ? message.replace(message.slice(4, message.length - 4), '...') : message
                return '[' + covertMessage + ']' + '(' + url + ')'
            }
        }
    }

    template_message: (parameters: TTemplateMessageConfig<GTemplate>) => string = (parameters) => {
        const { template, args, language = this.default_language } = parameters
        let message: string = this.file_template[language][template] || this.file_template[this.default_language][template] || this.default_template_data[template as unknown as string]
        if (!args) return message
        Object.keys(args).forEach(key => {
            const replaceMessage = message.replaceAll(`{{${key}}}`, args[key])
            if (replaceMessage) message = replaceMessage
        })
        return message
    }

    reply_markup(): GReplyMarkup {
        const dataReplyMarkup: TDefaultReplyMarkup = {
            force_reply: () => {
                return {
                    force_reply: true
                }
            },
            error: () => {
                return {
                    remove_keyboard: true
                }
            }
        }
        return dataReplyMarkup as unknown as GReplyMarkup
    }

    all_commands(language?: TTemplateLanguage): BotCommand[] {
        return []
    }


    /**
     * The **table_message** function is a function that converts a markdown table to a box drawing table.
     * @public
     *
     * @remarks
     * The markdownTable is a string that contains a markdown table.
     *
     * @example
     * ```ts
     * console.log(convertMarkdownTableToBoxDrawing(`
            | Header 1 | Header 2 | Header 3  | Header 3 |
            | :------- | :------- | :-------- | :------- |
            | Cell 1   | Cell 2   | Cell 3    | Cell 3   |
            | Cell 5   | Cell 6   | Cell 7    | Cell 8   |
            | Cell 9   | Cell 1   | Cell 1    | Cell 1   |
        `))
     * ```
     */
    table_message(markdownTable: string): string {
        const lines = markdownTable.trim().split('\n');
        const headers = lines[0].split('|').map(header => header.trim()).filter(header => header);
        const alignments = lines[1].split('|').map(header => header.trim()).filter(header => header);
        const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(cell => cell));

        const columnWidths = headers.map((header, i) => {
            return Math.max(header.length, ...rows.map(row => row[i].length));
        });

        const drawLine = (char: string, junction: string, start: string, end: string) => {
            return start + columnWidths.map(width => char.repeat(width + 2)).join(junction) + end;
        };

        const drawRow = (cells: string[], left: string, middle: string, right: string, alignments: string[]) => {
            return left + cells.map((cell, i) => {
                const width = columnWidths[i];
                if (alignments[i].startsWith(':') && alignments[i].endsWith(':')) {
                    return ' ' + cell.padStart((width + cell.length) / 2).padEnd(width) + ' ';
                } else if (alignments[i].endsWith(':')) {
                    return ' ' + cell.padStart(width) + ' ';
                } else {
                    return ' ' + cell.padEnd(width) + ' ';
                }
            }).join(middle) + right;
        };

        const topLine = drawLine('─', '┬', '┌', '┐');
        const headerLine = drawRow(headers, '│', '│', '│', alignments);
        const separatorLine = drawLine('─', '┼', '├', '┤');
        const bottomLine = drawLine('─', '┴', '└', '┘');
        const bodyLines = rows.map(row => drawRow(row, '│', '│', '│', alignments));

        return [topLine, headerLine, separatorLine, ...bodyLines, bottomLine].join('\n');
    }
}

export {
    EFlag,
    TelegramBotTemplate,
    DefaultTemplateData
};

