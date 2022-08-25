export enum ActionTypes {
  //FOR USER
  USER_AUTH = "[User] authentication",
  USER_AUTH_SUCCESS = "[User] authentication success",
  USER_AUTH_FAILURE = "[User] authentication failure",

  USER_LOG_OUT = "[User] logged out",

  //FOR ROOM
  ROOM_GET_MESSAGES = "[Room] get messages",
  ROOM_GET_MESSAGES_SUCCESS = "[Room] get messages success",
  ROOM_GET_MESSAGES_FAILURE = "[Room] get messages failure",

  ROOM_LOAD_MESSAGES = "[Room] load messages",
  ROOM_LOAD_MESSAGES_SUCCESS = "[Room] load messages success",
  ROOM_LOAD_MESSAGES_FAILURE = "[Room] load messages failure",

  ROOM_GET_AMOUNT_OF_MESSAGES = "[Room] get total of messages",
  ROOM_GET_AMOUNT_OF_MESSAGES_SUCCESS = "[Room] get total of messages success",
  ROOM_GET_AMOUNT_OF_MESSAGES_FAILURE = "[Room] get total of messages failure",

  ROOM_UPDATE_MESSAGE = "[Room] update messages",
  ROOM_REMOVE_MESSAGE = "[Room] remove message",

  //FOR CHAT
  CHAT_ROOM_SWITCH = "[Chat] switch room",
  CHAT_REMOVE_ROOM = "[Chat] remove room",
  CHAT_GET_NEW_ROOM = "[Chat] get new room",
  CHAT_GET_AVAILABLE_ROOMS = "[Chat] get available rooms",
  CHAT_SEARCH_ROOMS = "[Chat] search rooms",
  CHAT_REMOVE_PARTICIPANT = "[Room] remove participant",
  CHAT_ADD_PARTICIPANT = "[Room] add participant",

  //ROOM & CHAT
  ROOM_AND_CHAT_GET_NEW_MESSAGE = "[Room & Chat] get new messages",

  ROOM_AND_CHAT_MESSAGE_READ = "[Room & Chat] User read message",
  ROOM_AND_CHAT_MESSAGE_READ_SUCCESS = "[Room & Chat] User read message successfully",
  ROOM_AND_CHAT_MESSAGE_READ_FAILURE = "[Room & Chat] User read message failure",
}
