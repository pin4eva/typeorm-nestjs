export const MAIL_CLIENT = "MAIL_CLIENT";
export const MAIL_PORT = process.env.MAIL_PORT || 8001;
export const API_PORT = process.env.API_PORT || 8000;

export enum MailEventsEnum {
  VERIFY_ACCOUNT = "VERIFY_ACCOUNT",
  PROFILE_CREATED = "PROFILE_CREATED",
  LOGGED_IN = "LOGGED_IN",
  INVITE_USER = "INVITE_USER",
  RESET_AUTH = "RESET_AUTH",
}
