import { Manifest } from "deno-slack-sdk/mod.ts";
import { ChannelMembersFunctionDefinition } from "./functions/get_channel_members.ts";

export default Manifest({
  name: "Channel Member List",
  description: "Fetches all members of a specified Slack channel",
  icon: "assets/default_new_app_icon.png",
  functions: [ChannelMembersFunctionDefinition],
  outgoingDomains: [],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "users:read",
    "channels:read",
  ],
});
