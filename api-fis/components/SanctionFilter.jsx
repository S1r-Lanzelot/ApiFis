import { Grid, MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { addYears } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";

const disciplineCodes = {
  jp: "Ski Jumping (JP)",
  cc: "Cross-Country Skiing (CC)",
  nk: "Nordic Combined (NK)",
  al: "Alpine Skiing (AL)",
  fs: "Freestyle Skiing (FS)",
  sb: "Snowboarding (SB)",
  ma: "Masters (MA)",
  gs: "Grass Skiing (GS)",
  tm: "Telemark Skiing (TM)",
  ss: "Speed Skiing (SS)",
};

export const SanctionFilter = ({
  loading,
  discipline,
  season,
  name,
  onDisciplineChange,
  onSeasonChange,
  onNameChange,
}) => {
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          disabled={loading}
          select
          label="Discipline"
          value={discipline || ""}
          onChange={(event) => onDisciplineChange(event.target.value)}
          helperText={discipline ? undefined : "Select a discipline"}
        >
          {Object.entries(disciplineCodes).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={2}>
        <DatePicker
          slotProps={{
            field: { inputProps: { readOnly: true } },
            actionBar: {
              actions: ["clear"],
            },
            textField: { onClick: () => setYearPickerOpen(true), onKeyDown: () => setYearPickerOpen(true) },
          }}
          fullWidth
          disabled={loading || !discipline}
          label="Season"
          value={season ? new Date(season, 1, 1) : undefined}
          views={["year"]}
          minDate={new Date(1924, 1, 1)}
          maxDate={addYears(new Date(), 1)}
          onChange={(value) => onSeasonChange(value?.getFullYear())}
          open={yearPickerOpen}
          onOpen={() => setYearPickerOpen(true)}
          onClose={() => setYearPickerOpen(false)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          disabled={loading || !discipline}
          label="Person Name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </Grid>
    </Grid>
  );
};

SanctionFilter.propTypes = {
  loading: PropTypes.bool,
  discipline: PropTypes.oneOf(Object.keys(disciplineCodes)),
  season: PropTypes.number,
  name: PropTypes.string,
  onDisciplineChange: PropTypes.func.isRequired,
  onSeasonChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
};
