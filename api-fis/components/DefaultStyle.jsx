import { Global, css } from "@emotion/react";

export const GlobalStyle = () => (
  <Global
    styles={css`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }
    `}
  />
);
