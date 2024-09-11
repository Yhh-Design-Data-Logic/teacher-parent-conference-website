import { createItem, readItems, withToken, triggerFlow } from "@directus/sdk";

import { apiClient } from "../client/browser";

async function getAll() {
  const data = await apiClient.request(
    withToken(
      (await apiClient.getToken()) ?? "",
      readItems("meetings", {
        fields: [
          "id",
          {
            parent: ["id", "name"],
            teacher: ["id", "name"],
            timeslot: ["id", "start_date", "end_date"],
          },
        ],
      })
    )
  );

  return data;
}

const create = async (data: {
  parentId: number;
  teacherId: number;
  timeslotId: number;
}) => {
  const result = await apiClient.request(
    withToken(
      (await apiClient.getToken()) ?? "",
      createItem("meetings", {
        teacher: data.teacherId,
        parent: data.parentId,
        timeslot: data.timeslotId,
      })
    )
  );

  return result;
};

const getMeetingRoomToken = async (meetingId: number) => {
  const result = await apiClient.request<{
    app_id: number;
    effectiveTimeInSeconds: number;
    token: string;
    room_id: string;
    user_id: string;
    username?: string;
  }>(
    withToken(
      (await apiClient.getToken()) ?? "",
      triggerFlow("POST", "9edbd580-b370-4790-8c33-b2ed85ee3199", {
        meeting: `${meetingId}`,
      })
    )
  );

  return result;
};

const meetingsApi = { getAll, create, getMeetingRoomToken };
export default meetingsApi;
