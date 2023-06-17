import { FileDownload } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";

export function CsvExporter({ csvData, fileName, onDownload }) {
  return (
    <CSVLink style={{ textDecoration: "none", color: "inherit" }} data={csvData} target="_blank" filename={fileName}>
      <IconButton onClick={onDownload}>
        <FileDownload />
      </IconButton>
    </CSVLink>
  );
}

CsvExporter.propTypes = {
  csvData: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string.isRequired,
  onDownload: PropTypes.func,
};
