import { CssBaseline, Typography, Paper, Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { Helmet } from "react-helmet-async";
// import { SevereCold } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ErrorBoundary } from "../components/ErrorBoundary";
import styled from "@emotion/styled";
import { FIS_BLUE, FIS_GREY, FIS_YELLOW } from "../colors";

const Root = styled.div`
  min-height: 100vh;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: inherit;
  overflow: hidden;
`;

export const MainContent = styled(Paper)`
  flex: 1;
  background-image: url("/mtns.jpg");

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  box-shadow: none !important;
`;

export const Footer = styled(Stack)`
  background-color: ${FIS_BLUE};
  padding: 20px;
  text-align: center;
  position: sticky;
  bottom: 0;
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
            <Box width={"100%"} backgroundColor={FIS_YELLOW} borderBottom={`2px solid ${FIS_GREY}`}>
              <Typography variant="h6" gutterBottom display="inline" paddingLeft={1}>
                {title}
              </Typography>
            </Box>
            <ErrorBoundary>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box paddingX={1} paddingY={2}>
                  {children}
                </Box>
              </LocalizationProvider>
            </ErrorBoundary>
          </MainContent>
          <Footer>
            <Typography variant="body2" color="#FFFFFF">
              Created by John Lanz for the intended audience of the FIS IT department
            </Typography>
            <Typography variant="caption" fontStyle={"italic"} color="#FFFFFF">
              Loader and favicon by{" "}
              <a target="_blank" href="https://ski.ihoc.net/" rel="noreferrer">
                SkiFree
              </a>
              author Chris Pirih
            </Typography>
          </Footer>
        </AppContent>
      </main>
    </Root>
  );
};
