import { Alert, Paper, Stack } from "@mui/material";
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
      <Stack spacing={2} height="100%" display="flex" flexDirection="column">
        <SanctionFilter
          loading={loading}
          discipline={discipline}
          season={season}
          name={name}
          onDisciplineChange={setDiscipline}
          onSeasonChange={setSeason}
          onNameChange={setName}
        />
        {error && <ErrorAlert err={error} />}
        {response?.length > 0 && (
          <Alert severity="info">Only top 20 are shown, please utilize filters to find a particular sanction.</Alert>
        )}

        <Paper
          sx={{
            mb: "2px",
            height: "calc(100vh - 360px)",
            width: "100%",
            overflowY: "auto",
            background: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <SanctionTable sanctions={response || []} loading={loading} />
        </Paper>
      </Stack>
    </DefaultLayout>
  );
}

export default IndexPage;
