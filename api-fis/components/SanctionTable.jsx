import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
import { useMemo } from "react";
import { CsvExporter } from "./CsvExporter";
import { keyBy } from "lodash";
import { Backdrop, IconButton, Stack } from "@mui/material";
import { ViolationsDialog } from "./ViolationsDialog";
import { Info } from "@mui/icons-material";
import styled from "@emotion/styled";
import { FIS_YELLOW } from "../colors";
import { SkiFreeMonsterLoader } from "./SkiFreeMonsterLoader";

const StyledBackdrop = styled(Backdrop)`
  z-index: 1000 !important;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  border-radius: 16px;
`;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "date",
    label: "Date",
  },
  {
    id: "name",
    label: "Person Name",
  },
  {
    id: "sanction",
    label: "Sanction",
  },
  {
    id: "location",
    label: "Location",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "birthYear",
    label: "Birth Year",
  },
  {
    id: "gender",
    label: "Gender",
  },
  {
    id: "nation",
    label: "Nation",
  },
  {
    id: "fisCode",
    label: "FIS Code",
  },
  {
    id: "violations",
    label: "Violations",
  },
];

function SanctionTableHeader(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            disabled={rowCount === 0}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="right"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

SanctionTableHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function SanctionTableToolbar(props) {
  const { data, onDownload } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(data.length > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {data.length > 0 ? (
        <>
          <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
            {data.length} selected
          </Typography>
          <Tooltip title="Export">
            <CsvExporter
              csvData={data}
              fileName={`filtered_sanctions_${new Date().getTime()}.csv`}
              onDownload={onDownload}
            />
          </Tooltip>
        </>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          Sanctions
        </Typography>
      )}
    </Toolbar>
  );
}

const sanctionRecordToTableRecord = (sanctions, isSelected) => {
  return sanctions.reduce((arr, row) => {
    const violations = [];
    for (const violation of row.violations) {
      let violationText = [];
      if (violation.rule) {
        violationText.push(violation.rule);
      }
      if (violation.name) {
        violationText.push(violation.name);
      }
      violations.push(violationText.join(": "));
    }

    if (row.otherViolation) {
      violations.push(row.otherViolation);
    }

    let gender;
    switch (row.competitionSummary.genderCode) {
      case "M":
        gender = "Male";
        break;
      case "W":
        gender = "Female";
        break;
      case "A":
      default:
        gender = "Neutral";
        break;
    }

    let person;
    switch (row.function) {
      case "athlete":
        person = row.athlete;
        break;
      case "official":
      case "team":
        person = {
          firstName: row.firstName,
          lastName: row.lastName,
        };
        gender = "Unknown";
        break;
      default:
        gender = "Unknown";
        break;
    }

    let baseRow = {
      date: new Date(row.competitionSummary.date).toLocaleDateString(),
      name: person ? `${person.lastName}, ${person.firstName}` : "Unknown",
      location: `${row.competitionSummary.place}, ${row.competitionSummary.placeNationCode}`,
      category: row.competitionSummary.categoryCode,
      birthYear: person?.birthYear || "Unknown",
      gender,
      nation: person?.nationCode || "Unknown",
      fisCode: person?.fisCode || "Unknown",
      violations,
      remarks: row.remarks,
    };

    for (const sanction of row.sanctions) {
      const key = row.id + sanction.title;
      const isKeySelected = isSelected(key);
      const labelId = `table-checkbox-${row.id}`;

      arr.push({
        key,
        labelId,
        isSelected: isKeySelected,
        ...baseRow,
        sanction: sanction.title,
      });
      return arr;
    }
  }, []);
};

export const SanctionTable = ({ sanctions, loading }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);
  const [selectedViolationsDetail, setSelectedViolationsDetail] = useState(undefined);

  const handleRequestSort = (_, property) => {
    console.log(property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => setSelected(event.target.checked ? sortedRows.map((n) => n.key) : []);

  const handleClick = (_, key) => {
    const selectedIndex = selected.indexOf(key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const sortedRows = useMemo(
    () =>
      stableSort(
        sanctionRecordToTableRecord(sanctions, (key) => selected.indexOf(key) !== -1),
        getComparator(order, orderBy)
      ),
    [sanctions, order, orderBy, selected]
  );

  const csvData = useMemo(() => {
    if (!selected || selected.length === 0) return [];

    const rowMap = keyBy(sortedRows, "key");
    return selected.reduce((arr, key) => {
      if (key in rowMap) {
        const { key: _, labelId: __, isSelected: ___, violations, ...row } = rowMap[key];
        row.violations = violations.join(", ");
        arr.push(row);
      }
      return arr;
    }, []);
  }, [sortedRows, selected]);

  return (
    <Stack height="100%">
      <SanctionTableToolbar data={csvData} onDownload={() => setSelected([])} />
      <TableContainer>
        <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="Sanction Table" size="small">
          <SanctionTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={sanctions.length}
          />
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.key)}
                role="checkbox"
                aria-checked={row.isSelected}
                tabIndex={-1}
                key={row.key}
                selected={row.isSelected}
                sx={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={row.isSelected}
                    inputProps={{
                      "aria-labelledby": row.labelId,
                    }}
                  />
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.sanction}</TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell align="right">{row.category}</TableCell>
                <TableCell align="right">{row.birthYear}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                <TableCell align="right">{row.nation}</TableCell>
                <TableCell align="right">{row.fisCode}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedViolationsDetail({
                        title: `${row.date} - ${row.name}`,
                        sanction: row.sanction,
                        violations: row.violations,
                        remarks: row.remarks,
                      });
                    }}
                  >
                    <Info sx={{ color: FIS_YELLOW }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={12}>
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedViolationsDetail && (
        <ViolationsDialog {...selectedViolationsDetail} onClose={() => setSelectedViolationsDetail(undefined)} />
      )}
      {loading && (
        <StyledBackdrop open>
          <SkiFreeMonsterLoader />
        </StyledBackdrop>
      )}
    </Stack>
  );
};

SanctionTable.propTypes = {
  sanctions: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};
