import React, { useEffect, useContext, useState } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, TableContainer, Table } from "@material-ui/core";
import * as AppType from "apptype";
import { AppContext } from "../../../AppContext";
import UnderlingHead from "./UnderlingHead";
import UnderlingBody from "./UnderlingBody";
import BudgetPerson from "../../Chart/Pie/BudgetPerson";

const useStyles = makeStyles(theme => ({
  tablePaper: {
    margin: "0 auto",
    maxWidth: 1200
  },
  table: {
    maxHeight: window.innerHeight * 0.9
  }
}));

export interface UnderlingProps {}

const Underling: React.FC<UnderlingProps> = () => {
  const classes = useStyles();
  const { apiUrl, fetchPost } = useContext(AppContext);
  const [userList, setUserList] = useState<any | null>(null);
  const passingProps: any = {
    ...useContext(AppContext),
    userList,
    setUserList
  };

  async function handleLoadUnderling() {
    const response = await fetchPost({
      url: apiUrl("loadusersystem"),
      body: { action: "dashboard", type: "person" }
    });
    setUserList(response);
  }

  useEffect(() => {
    handleLoadUnderling();
  }, []);

  return (
    <AppContext.Provider value={passingProps}>
      <BudgetPerson />
      <div style={{ padding: 8 }}>
        <Paper elevation={2} className={classes.tablePaper}>
          <TableContainer className={classes.table}>
            <Table stickyHeader>
              <UnderlingHead />
              <UnderlingBody />
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </AppContext.Provider>
  );
};
export default Underling;
