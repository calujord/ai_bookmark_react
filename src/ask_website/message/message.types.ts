export interface MessageProperties {
  /**
   * Message to be displayed
   */
  message: string;
  /**
   * User name only can be 'user' or 'bot'
   */
  username: string;
}

export interface Message extends MessageProperties {}
