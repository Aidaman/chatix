export enum ActionTypes {
  //FOR USER
  USER_AUTH = '[User] authentication',
  USER_AUTH_SUCCESS = '[User] authentication success',
  USER_AUTH_FAILURE = '[User] authentication failure',

  USER_ACCEPT_INVITATION = '[User] invitation accepted',
  USER_REJECT_INVITATION = '[User] invitation rejected',

  USER_LOG_OUT = '[User] logged out',

  //FOR ROOM
  ROOM_SWITCH = '[Room] switch room',
  ROOM_SWITCH_SUCCESS = '[Room] switch room success',
  ROOM_SWITCH_FAILURE = '[Room] switch room failure',

  ROOM_GET_MESSAGES = '[Room] get messages',
  ROOM_GET_MESSAGES_SUCCESS = '[Room] get messages success',
  ROOM_GET_MESSAGES_FAILURE = '[Room] get messages failure',

  ROOM_SEND_MESSAGE = '[Room] send messages',
  ROOM_SEND_MESSAGE_SUCCESS = '[Room] sent message successfully',
  ROOM_SEND_MESSAGE_FAILURE = '[Room] sending message failure',

  ROOM_GET_PARTICIPANTS = '[Room] get participants',
  ROOM_GET_PARTICIPANTS_SUCCESS = '[Room] get participants success',
  ROOM_GET_PARTICIPANTS_FAILURE = '[Room] get participants failure',

  ROOM_REMOVE_PARTICIPANT = '[Room] remove participant',
  ROOM_REMOVE_PARTICIPANT_SUCCESS = '[Room] remove participant success',
  ROOM_REMOVE_PARTICIPANT_FAILURE = '[Room] remove participant failure',

  ROOM_ADD_PARTICIPANT = '[Room] add participant',
  ROOM_ADD_PARTICIPANT_SUCCESS = '[Room] add participant success',
  ROOM_ADD_PARTICIPANT_FAILURE = '[Room] add participant failure',

  ROOM_INVITE_PARTICIPANT = '[Room] invite user',
  ROOM_INVITE_PARTICIPANT_SUCCESS = '[Room] invite user success',
  ROOM_INVITE_PARTICIPANT_FAILURE = '[Room] invite user failure',

  //FOR CHAT
  CHAT_GET_AVAILABLE_ROOMS = '[Chat] get available rooms',
  CHAT_GET_AVAILABLE_ROOMS_SUCCESS = '[Chat] get available rooms success',
  CHAT_GET_AVAILABLE_ROOMS_FAILURE = '[Chat] get available room failure',

  CHAT_NEW_MESSAGE = '[Chat] new message',


}
