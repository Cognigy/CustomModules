/**
 * Custom Node to change the bot's avatar image.
 * @arg {CognigyScript} `avatarUrl` The URL of your bot's avatar. It has to be a public link to the actual image.
 */
async function changeBotAvatar(input: any, args: { avatarUrl: string }): Promise<IFlowInput | {}> {

  const { avatarUrl } = args;
  if (!avatarUrl) throw new Error('No avatar url defined. You need this to change the avatar image of the bot');

  input.actions.output("", {
    "_webchat": {
      "botAvatarOverrideUrl": avatarUrl
    }
  });

  return input;
}

module.exports.changeBotAvatar = changeBotAvatar;


/**
 * Custom Node to reset the bot's avatar image.
 */
async function resetBotAvatar(input: any, args: {}): Promise<IFlowInput | {}> {

  input.actions.output("", {
    "_webchat": {
      "botAvatarOverrideUrl": ""
    }
  });

  return input;
}

module.exports.resetBotAvatar = resetBotAvatar;


/**
 * Custom Node to change the user's avatar image.
 * @arg {CognigyScript} `avatarUrl` The URL of your user's avatar. It has to be a public link to the actual image.
 */
async function changeUserAvatar(input: any, args: { avatarUrl: string }): Promise<IFlowInput | {}> {

  const { avatarUrl } = args;
  if (!avatarUrl) throw new Error('No avatar url defined. You need this to change the avatar image of the bot');

  input.actions.output("", {
    "_webchat": {
      "userAvatarOverrideUrl": avatarUrl
    }
  });

  return input;
}

module.exports.changeUserAvatar = changeUserAvatar;


/**
 * Custom Node to reset the user's avatar image.
 */
async function resetUserAvatar(input: any, args: {}): Promise<IFlowInput | {}> {

  input.actions.output("", {
    "_webchat": {
      "userAvatarOverrideUrl": ""
    }
  });

  return input;
}

module.exports.resetUserAvatar = resetUserAvatar;