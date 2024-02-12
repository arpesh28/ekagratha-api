export const errorMessages = {
  // Common Errors
  SOMETHING_WRONG: "Something went wrong",
  UNAUTHORIZED: "Unauthorized",
  INVALID_ID: "Invalid ID!",

  //    Auth Errors
  EMAIL_REGISTERED_WITH_OTHER_PROVIDER:
    "Email address is registered with another provider",
  UNKNOWN_SUBSCRIBER_ID: "Unknown Subscriber id",
  EMAIL_NOT_FOUND: "Email not found!",
  EMAIL_ALREADY_EXISTS: "Email already exists!",
  EMAIL_NOT_VERIFIED: "Email not verified. Please verify your email address.",
  EMAIL_ALREADY_VERIFIED: "Email is already verified!",
  OTP_EXPIRED: "OTP is expired!",
  NO_ACTIVE_OTP: "No active otp has been sent to this email!",
  INVALID_OTP: "Invalid OTP!",
  INVALID_CREDENTIALS: "Email/Password is invalid!",
  GOOGLE_CODE_MISSING: "Google Authorization Code is required!",
  GOOGLE_AUTH_FAILED: "Failed to authenticate with Google",
  DISCORD_CODE_MISSING: "Discord Authorization Code is required!",
  DISCORD_AUTH_FAILED: "Failed to authenticate with Discord",
  GITHUB_CODE_MISSING: "Github Authorization Code is required!",
  GITHUB_AUTH_FAILED: "Failed to authenticate with Github",
  // Teams Errors
  TEAM_ID_REQUIRED: "Team ID is required.",
  TEAM_NOT_FOUND: "Team not found!",
};

export const successMessages = {
  TEAM_DELETED: "Team deleted Successfully!",
};
