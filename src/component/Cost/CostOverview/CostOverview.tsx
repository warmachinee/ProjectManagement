import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { Paper, TableContainer, Table } from "@material-ui/core";
import CostOverviewHead from "./CostOverviewHead";
import CostOverviewBody from "./CostOverviewBody";
import AppType from "apptype";

const useStyles = makeStyles(theme => ({}));

export interface CostOverviewProps {}

const CostOverview: React.FC<CostOverviewProps> = () => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,

    projectid,
    sess,
    userid
  } = useContext(AppContext);
  const [costOverview, setCostOverview] = useState<AppType.CostOverview | null>(
    null
  );

  const passingProps: any = {
    ...useContext(AppContext),
    handleLoadCostOverview,
    costOverview
  };

  async function handleLoadCostOverview() {
    const response: any | AppType.CostOverview = await fetchPost({
      url: apiUrl("loadproject"),
      body: {
        action: "costoverview",
        projectid,
        ...(sess.type === "manager" && userid && { userid })
      }
    });
    setCostOverview(response);
  }

  useEffect(() => {
    handleLoadCostOverview();
  }, []);

  return (
    <AppContext.Provider value={passingProps}>
      <TableContainer>
        <Table stickyHeader>
          <CostOverviewHead />
          <CostOverviewBody />
        </Table>
      </TableContainer>
    </AppContext.Provider>
  );
};
export default CostOverview;
