import {
  Typography,
  Stack,
  DialogTitle,
  Dialog,
  useTheme,
  useMediaQuery,
  DialogContent,
  IconButton,
} from "@mui/material";
import { ulid } from "ulid";
import PropTypes from "prop-types";
import { Close } from "@mui/icons-material";

export const ViolationsDialog = ({ title, violations, sanction, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog fullScreen={fullScreen} fullWidth open onClose={onClose}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="span" gutterBottom>
          {sanction}
        </Typography>
        <Stack spacing={2}>
          {violations.map((violation) => (
            <Typography variant="body1" key={ulid()}>
              {violation}
            </Typography>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

ViolationsDialog.propTypes = {
  violations: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  sanction: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};