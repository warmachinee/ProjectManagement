import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TableContainer, Table } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import THead from "./THead";
import TBody from "./TBody";

const useStyles = makeStyles(theme => ({
  table: {
    maxHeight: window.innerHeight * 0.9
  }
}));

export interface TContainerProps {}

const TContainer: React.FC<TContainerProps> = props => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.table}>
      <Table stickyHeader>
        <THead />
        <TBody />
        {/* <DndProvider backend={Backend}></DndProvider> */}
      </Table>
    </TableContainer>
  );
};
export default TContainer;
