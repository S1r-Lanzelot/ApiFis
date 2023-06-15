import { getApi } from "../../utils/fetch";

export const listSanctionsApi = async (discipline, season, name) => {
  let params = { discipline };
  if (season) {
    params.season = season;
  }
  if (name) {
    params.name = name;
  }

  return await getApi("/api/sanctions", params);
};
