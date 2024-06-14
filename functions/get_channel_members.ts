import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ChannelMembersFunctionDefinition = DefineFunction({
  callback_id: "get_channel_members",
  title: "Get Channel Members",
  description: "Fetches all members of a specified Slack channel",
  source_file: "functions/get_channel_members.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "Channel to fetch members from",
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      members: {
        type: Schema.types.string,
        description: "List of members in the channel",
      },
      error: {
        type: Schema.types.string,
        description: "Error message if any",
      },
    },
    required: ["members", "error"], // Ensuring both are always present
  },
});

export default SlackFunction(
  ChannelMembersFunctionDefinition,
  async ({ inputs, client }) => {
    const { channel_id } = inputs;

    try {
      const membersResponse = await client.conversations.members({
        channel: channel_id,
      });
      const memberIds = membersResponse.members;

      const memberDetails = await Promise.all(
        memberIds.map(async (memberId: string) => { // Explicitly declaring memberId as string
          const userInfo = await client.users.info({ user: memberId });
          return `${userInfo.user.real_name} (${userInfo.user.id})`;
        }),
      );

      return {
        outputs: {
          members: memberDetails.join(", "),
          error: "", // No error, return an empty string
        },
      };
    } catch (error) {
      console.error("Failed to retrieve channel members:", error);
      return {
        outputs: {
          members: "", // No members due to error, return an empty string
          error: error.message,
        },
      };
    }
  },
);
