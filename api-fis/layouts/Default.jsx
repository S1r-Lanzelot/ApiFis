import { CssBaseline, Typography, Paper, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { Helmet } from "react-helmet-async";
// import { SevereCold } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ErrorBoundary } from "../components/ErrorBoundary";
import styled from "@emotion/styled";

const Root = styled.div`
  min-height: 100vh;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: inherit;
  padding: 10px;
`;

export const MainContent = styled(Paper)`
  flex: 1;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  box-shadow: none !important;
`;

export const DefaultLayout = (props) => {
  const { title, children } = props;
  const theme = useTheme();

  const isLgUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Root>
      <CssBaseline />
      <main
        style={{
          minHeight: "inherit",
        }}
      >
        <AppContent>
          <MainContent p={isLgUp ? 12 : 5}>
            <Helmet title={title} />
            <Stack direction="row" spacing={2}>
              <Typography variant="h3" gutterBottom display="inline">
                {title}
              </Typography>
            </Stack>
            <ErrorBoundary>
              <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
            </ErrorBoundary>
          </MainContent>
        </AppContent>
      </main>
    </Root>
  );
};
