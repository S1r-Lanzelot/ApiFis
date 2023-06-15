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
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
import { useMemo } from "react";
import { CsvExporter } from "./CsvExporter";
import { keyBy } from "lodash";
import { ulid } from "ulid";
import { Stack } from "@mui/material";

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
    label: "Athlete Name",
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
  const { data } = props;

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
            <CsvExporter csvData={data} fileName={`filtered_sanctions_${new Date().getTime()}.csv`} />
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
      if (violation.title) {
        violationText.push(violation.title);
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

    let baseRow = {
      date: new Date(row.competitionSummary.date).toLocaleDateString(),
      name: `${row.athlete.lastName}, ${row.athlete.firstName}`,
      location: `${row.competitionSummary.place}, ${row.competitionSummary.placeNationCode}`,
      category: row.competitionSummary.categoryCode,
      birthYear: row.athlete.birthYear,
      gender,
      nation: row.athlete.nationCode,
      fisCode: row.athlete.fisCode,
      violations,
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

export const SanctionTable = ({ sanctions }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);

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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <SanctionTableToolbar data={csvData} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="Sanction Table" size="small">
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
                <>
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
                  </TableRow>
                  {row.violations.length > 0 && (
                    <Stack width={"100%"}>
                      {row.violations.map((violation) => (
                        <Typography key={ulid()} variant="subtitle1">
                          {violation}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </>
              ))}
              {sortedRows.length === 0 && (
                <TableRow
                  style={{
                    height: 33,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

SanctionTable.propTypes = {
  sanctions: PropTypes.array.isRequired,
};
