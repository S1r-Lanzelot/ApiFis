import { Alert, Stack } from "@mui/material";
import { ErrorAlert } from "../components/ErrorAlert";
import { SanctionFilter } from "../components/SanctionFilter";
import { SanctionTable } from "../components/SanctionTable";
import { useState } from "react";
import { listSanctionsApi } from "../api/functions/sanctions";
import usePromise from "react-use-promise";
import { DefaultLayout } from "../layouts/Default";
import { useDebounce } from "use-debounce";

function IndexPage() {
  const [discipline, setDiscipline] = useState();
  const [season, setSeason] = useState();
  const [name, setName] = useState();
  const [debouncedName] = useDebounce(name, 1000);

  const [response, error, state] = usePromise(() => {
    if (!discipline) {
      return Promise.resolve([]);
    }

    return listSanctionsApi(discipline, season, debouncedName);
  }, [discipline, season, debouncedName]);

  const loading = state === "pending";

  return (
    <DefaultLayout title="FIS Sanction Explorer" loading={loading}>
      <Stack gap={2}>
        {error && <ErrorAlert err={error} />}
        <SanctionFilter
          loading={loading}
          discipline={discipline}
          season={season}
          name={name}
          onDisciplineChange={setDiscipline}
          onSeasonChange={setSeason}
          onNameChange={setName}
        />
        {response?.length > 0 && (
          <Alert severity="info">Only top 20 are shown, please utilize filters to find a particular sanction.</Alert>
        )}
        <SanctionTable sanctions={response || []} />
      </Stack>
    </DefaultLayout>
  );
}

export default IndexPage;
