import { Grid } from "@mui/material";
import Image from "next/image";

export const SkiFreeMonsterLoader = () => {
  return (
    <Grid container justifyContent="center">
      <Image src="/skiFreeMonster.gif" alt="Loading..." width={"85px"} height={"85px"} />
    </Grid>
  );
};
