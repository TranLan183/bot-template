import { bot_template } from "../index";


export const handleBotInlineMode = () => {
    const { ConvertTeleError, tele_bot } = bot_template
    tele_bot.on('inline_query', async (ctx) => {
        // SetLastMessageReceivedDate()
        // // console.log(JSON.stringify(ctx));
        // const { userId, query } = convertInlineContext(ctx)
        // const images = await LocalCache.image_cache_by_tg.get(userId)
        // const result: InlineQueryResult[] = images.data.map(photo_file_id => ({
        //     type: 'photo',
        //     id: `image-${photo_file_id}`,
        //     photo_file_id
        // }))
        // console.log(result)
        // await ctx.answerInlineQuery(result)
    });
}