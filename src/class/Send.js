const UserSchema = require('../models/user.model');
const WallpaperSchema = require('../models/wallpapers.model');
const Fetch = require('./Fetch');
const Favorite = require('./Favorite');
const keyboard = require('../libs/keyboard');
const InlineKeyboard = keyboard.InlineKeyboard;
const cst = require('../libs/const');
const message = cst.msg;

/**
 * Simple caption
 *
 * @param {Array} anime
 * @returns string
 */
const simpleCaption = (anime) => {
  return `<u>Title</u> : <b>${anime.title ? anime.title : '?'}</b>`;
};

/**
 * Send
 */
class Send {
  /**
   * Send user's favorite anime
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendFavorites(bot, msg) {
    const user = await UserSchema.findOne({ chatId: msg.chat.id });
    if (user && user.favorites && user.favorites.length > 0) {
      bot.sendMessage(msg.chat.id, message.FAVORITE_TITLE_MSG, {
        parse_mode: 'HTML',
      });
      for (let i = 0; i < user.favorites.length; i++) {
        const favorite = user.favorites[i];
        bot.sendPhoto(msg.chat.id, `${favorite.img}`, {
          caption: `\n⭐️ ${favorite.title.slice(0, 19)}...\n👁 show /anime_${favorite.id}`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: InlineKeyboard.favorite(favorite),
          },
        });
      }
    } else {
      bot.sendMessage(msg.chat.id, message.EMPTY_FAVORITES_MSG, {
        parse_mode: 'HTML',
      });
    }
  }

  /**
   * Send user feedback request
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.CallbackQuery} query
   * @param {{value: any}} data
   */
  static async sendFeedbacks(bot, query, data) {
    if (data.value === 'Yes') {
      bot.editMessageText(message.FEEDBACK_MSG, {
        parse_mode: 'HTML',
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: InlineKeyboard.feedbacks(),
        },
      });
    } else {
      bot.editMessageText('Glad you changed your mind', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
      });
    }
  }

  /**
   * Send top anime
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   * @param {String} subtype
   */
  static async sendTopAnime(bot, msg, subtype) {
    bot.sendChatAction(msg.chat.id, 'upload_photo');
    let anime = await Fetch.getTopAnime(subtype);
    const current = 0;
    anime = anime[current];
    const favorite = (await Favorite.isFavorite(msg.chat.id, anime.mal_id)) ? '⭐️' : '☆';
    const caption = simpleCaption(anime);
    bot.sendPhoto(msg.chat.id, anime.image_url, {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: InlineKeyboard.showMore(
          anime.url,
          anime.mal_id,
          favorite,
          current,
          subtype
        ),
      },
    });
  }

  /**
   * Send Anime
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendAnime(bot, msg) {
    const id = msg.text.split('_')[1];
    bot.sendChatAction(msg.chat.id, 'upload_photo');
    const anime = await Fetch.getAnimeDetail(id);
    const favorite = (await Favorite.isFavorite(msg.chat.id, anime.mal_id)) ? '⭐️' : '☆';
    const caption = simpleCaption(anime);
    bot.sendPhoto(msg.chat.id, anime.image_url, {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: InlineKeyboard.showMore(anime.url, anime.mal_id, favorite, null, null),
      },
    });
  }

  /**
   * Send the complete synopsis of an anime
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendAllSynopsis(bot, msg) {
    const id = msg.text.split('_')[1] * 1;
    bot.sendChatAction(msg.chat.id, 'typing');
    const details = await Fetch.getAnimeDetail(id);
    bot.sendMessage(msg.chat.id, message.SYNOPSIS_MSG(details), {
      reply_to_message_id: msg.message_id,
      parse_mode: 'HTML',
    });
  }

  /**
   * Send Trailer
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendTrailer(bot, msg) {
    const id = msg.text.split('_')[1] * 1;
    bot.sendChatAction(msg.chat.id, 'typing');
    const details = await Fetch.getAnimeDetail(id);
    bot.sendMessage(
      msg.chat.id,
      details.trailer_url ? details.trailer_url : message.NO_TRAILER_MSG,
      {
        reply_to_message_id: msg.message_id,
      }
    );
  }

  /**
   * Search anime
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendSearch(bot, msg) {
    const wMsg = await bot.sendMessage(msg.chat.id, message.WAIT_MSG, {
      reply_to_message_id: msg.message_id,
    });
    const words = msg.text.trim().split(' ');

    const param = words.slice(1, words.length - 1).join(' ');
    const param2 = words[words.length - 1] * 1;

    if (!param) {
      return await bot.editMessageText(message.SEARCH_ERROR, {
        chat_id: msg.chat.id,
        message_id: wMsg.message_id,
      });
    }
    const anime = await Fetch.searchAnimeByName(param);
    const max = typeof param2 === 'number' && !isNaN(param2) ? param2 : 20;
    bot.editMessageText(`👇 ${max} results for "${param}" 👇`, {
      chat_id: msg.chat.id,
      message_id: wMsg.message_id,
    });
    for (let i = 0; i < max; i++) {
      const anm = anime[i];
      const favorite = (await Favorite.isFavorite(msg.chat.id, anm.mal_id)) ? '⭐️' : '☆';
      const caption = simpleCaption(anm);
      bot.sendPhoto(msg.chat.id, anm.image_url, {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: InlineKeyboard.showMore(anm.url, anm.mal_id, favorite),
        },
      });
    }
  }

  /**
   * Random wallpaper
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendRandomWallpaper(bot, msg) {
    const wallpapers = await WallpaperSchema.find({});
    const index = Math.floor(Math.random() * wallpapers.length);
    const wallpaper = wallpapers[index];
    if (wallpaper) {
      bot.sendPhoto(msg.chat.id, wallpaper.fileId, {
        caption: wallpaper.caption,
        parse_mode: 'HTML',
      });
    }
  }

  /**
   * search wallpaper
   *
   * @param {TelegramBot} bot
   * @param {TelegramBot.Message} msg
   */
  static async sendWallpaper(bot, msg) {
    const param = msg.text.trim().toLowerCase().split(' ')[1];
    const params = msg.text.trim().toLowerCase().split(' ').slice(1);
    if (param?.length > 2) {
      const allWallpapers = await WallpaperSchema.find({});

      const wallpapers = allWallpapers.filter(
        (w) => w.caption.toLowerCase().trim().search(params.join('_').trim()) !== -1
      );
      if (wallpapers.length === 0) {
        return bot.sendMessage(msg.chat.id, 'No results 🌵');
      }
      for (let i = 0; i < wallpapers.length; i++) {
        const w = wallpapers[i];
        bot.sendPhoto(msg.chat.id, w.fileId, {
          caption: w.caption,
          parse_mode: 'HTML',
        });
      }
    } else {
      bot.sendMessage(msg.chat.id, 'too short name ! /help');
    }
  }
}

module.exports = Send;
