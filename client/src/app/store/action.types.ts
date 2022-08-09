export enum ActionTypes {
  //FOR USER
  USER_AUTH = "[User] authentication",
  USER_AUTH_SUCCESS = "[User] authentication success",
  USER_AUTH_FAILURE = "[User] authentication failure",

  USER_ACCEPT_INVITATION = "[User] invitation accepted",
  USER_REJECT_INVITATION = "[User] invitation rejected",

  USER_LOG_OUT = "[User] logged out",

  //FOR ROOM
  ROOM_SWITCH = "[Room] switch room",
  ROOM_SWITCH_SUCCESS = "[Room] switch room success",
  ROOM_SWITCH_FAILURE = "[Room] switch room failure",

  ROOM_GET_MESSAGES = "[Room] get messages",
  ROOM_GET_MESSAGES_SUCCESS = "[Room] get messages success",
  ROOM_GET_MESSAGES_FAILURE = "[Room] get messages failure",

  ROOM_LOAD_MESSAGES = "[Room] load messages",
  ROOM_LOAD_MESSAGES_SUCCESS = "[Room] load messages success",
  ROOM_LOAD_MESSAGES_FAILURE = "[Room] load messages failure",

  ROOM_GET_NEW_MESSAGE = "[Room] get new messages",
  ROOM_GET_NEW_MESSAGE_SUCCESS = "[Room] get new messages success",
  ROOM_GET_NEW_MESSAGE_FAILURE = "[Room] get new messages failure",

  ROOM_GET_AMOUNT_OF_MESSAGES = "[Room] get total of messages",
  ROOM_GET_AMOUNT_OF_MESSAGES_SUCCESS = "[Room] get total of messages success",
  ROOM_GET_AMOUNT_OF_MESSAGES_FAILURE = "[Room] get total of messages failure",

  ROOM_SEND_MESSAGE = "[Room] send messages",
  ROOM_SEND_MESSAGE_SUCCESS = "[Room] sent message successfully",
  ROOM_SEND_MESSAGE_FAILURE = "[Room] sending message failure",

  ROOM_UPDATE_MESSAGE = "[Room] update messages",
  ROOM_UPDATE_MESSAGE_SUCCESS = "[Room] updated message successfully",
  ROOM_UPDATE_MESSAGE_FAILURE = "[Room] updating message failure",

  ROOM_REMOVE_MESSAGE = "[Room] remove message",
  ROOM_REMOVE_MESSAGE_SUCCESS = "[Room] removed message successfully",
  ROOM_REMOVE_MESSAGE_FAILURE = "[Room] removing message failure",

  ROOM_MESSAGE_READ = "[Room] User read message",
  ROOM_MESSAGE_READ_SUCCESS = "[Room] User read message successfully",
  ROOM_MESSAGE_READ_FAILURE = "[Room] User read message failure",

  ROOM_REMOVE_PARTICIPANT = "[Room] remove participant",
  ROOM_REMOVE_PARTICIPANT_SUCCESS = "[Room] remove participant success",
  ROOM_REMOVE_PARTICIPANT_FAILURE = "[Room] remove participant failure",

  ROOM_ADD_PARTICIPANT = "[Room] add participant",
  ROOM_ADD_PARTICIPANT_SUCCESS = "[Room] add participant success",
  ROOM_ADD_PARTICIPANT_FAILURE = "[Room] add participant failure",

  ROOM_GET_UNREAD = "[Room] get unread",
  ROOM_GET_UNREAD_SUCCESS = "[Room] get unread success",
  ROOM_GET_UNREAD_FAILURE = "[Room] get unread failure",

  //FOR CHAT
  CHAT_GET_AVAILABLE_ROOMS = "[Chat] get available rooms",
  CHAT_GET_AVAILABLE_ROOMS_SUCCESS = "[Chat] get available rooms success",
  CHAT_GET_AVAILABLE_ROOMS_FAILURE = "[Chat] get available room failure",

  CHAT_SEARCH_ROOMS = "[Chat] search rooms",
  CHAT_SEARCH_ROOMS_SUCCESS = "[Chat] search rooms success",
  CHAT_SEARCH_ROOMS_FAILURE = "[Chat] search room failure",

  CHAT_NEW_MESSAGE = "[Chat] new message",


}
