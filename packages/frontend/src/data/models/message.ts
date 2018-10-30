import Model from 'ember-data/model';
import { attr, belongsTo } from '@ember-decorators/data';

import Identity from 'emberclear/data/models/identity/model';

/**
 * types:
 *
 * CHAT:       a standard message sent to a person or room.
 *
 * EMOTE:      same as chat, but with special formatting for
 *             talking about oneself in the 3rd person.
 *
 * WHISPER:    same as chat, but explictly only intended for a single person
 *
 * PING:       a system message used to determine who is online upon app-boot
 *
 * DELIVERY_CONFIRMATION: a system message automatically sent back to someone
 *                        who sent you a message so that they know you received it
 *
 * DISCONNECT: a courtesy message to notify your contacts that you
 *             are about to go offline.
 *
 * Properties of:
 *   Chat, Emote
 *   - channel: the id of the channel this message is intended for
 *              NOTE: additional channel properties (such as encryption, members, etc)
 *                    will ultimately be stored on the channel.
 *                    However, in order to make sure everyone's member list is up to date,
 *                    the member list will be sent along wich each message
 *              TODO: decide whether these extra properties live in the body json
 *              TODO: do we want structureless data in the body?
 *
 *   Whisper, Ping, Disconnect
 *   - no properties that alter behavior / message routing
 *
 * Currently Unused Properties:
 *  - contentType, thread
 *
 * Currently Unused Message Types:
 *  - emote, delivery confirmation
 *
 * TODO: should types and targets be separated?
 *       I think that would allow more flexibility.
 *
 *       Examples:
 *         target: 'whisper', type: 'chat',
 *         target: 'whisper', type: 'emote',
 *         target: null,      type: 'ping',
 *         target: 'message', type: 'delivery-confirmation',
 *         target: 'channel', type: 'chat',
 *         target: 'channel', type: 'emote',
 *
 *         * to: IdentityID | ChannelID
 *           - would no longer need channel as separate property
 *         * thread: guid - independent of all the above, still
 *
 *       The answer: yes -- I think this'll clear up a lot of protocol intent confusion
 *
 *
 * */

export enum TYPE {
  CHAT = 'chat',
  EMOTE = 'emote',
  PING = 'ping',
  DISCONNECT = 'disconnect',
  DELIVERY_CONFIRMATION = 'delivery-confirmation'
}

export enum TARGET {
  NONE = '',
  WHISPER = 'whisper',
  CHANNEL = 'channel',
  MESSAGE = 'message',
}


  export default class Message extends Model {

  /**
   * from: the id of an identity
   * */
  @attr('string') from!: string;

  /**
   * identityId | channelId // should these have different formats?;
   * */
  @attr('string') to!: string;

  /**
   * Contents of body may depend on the TYPE/TARGET
   * */
  @attr('string') body!: string;

  @attr('string') type!: TYPE;
  @attr('string') target!: TARGET;

  @attr('string') thread!: string;

  @attr('date') receivedAt?: Date;
  @attr('date') sentAt!: Date;
  @attr('string') sendError?: string;

  @belongsTo('identity', { async: true }) sender?: Identity;

  // currently unused
  @attr('string') contentType!: string;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data' {
  interface ModelRegistry {
    'message': Message;
  }
}
