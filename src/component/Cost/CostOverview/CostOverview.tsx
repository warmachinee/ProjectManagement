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
  const { apiUrl, fetchPost, _onLocalhostFn, projectid } = useContext(
    AppContext
  );
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
      body: { action: "costoverview", projectid }
    });
    setCostOverview(response);
  }

  function handleFetchTemp() {
    setCostOverview({
      projectcost: {
        projectid: 9422312,
        projectname: "Energy Project",
        projectcost: 27000000,
        op: 2349000,
        op_percent: 8.7,
        mf: 1350000,
        mf_percent: 5,
        totalest: 747000,
        totalact: 718500
      },
      detail: [
        { type: "hardware", sumest: 747000, sumact: 718500 },
        { type: "software", sumest: 0, sumact: 0 },
        { type: "customization", sumest: 0, sumact: 0 },
        { type: "training", sumest: 0, sumact: 0 },
        { type: "managementfee", sumest: 0, sumact: 0 },
        { type: "entertain", sumest: 0, sumact: 0 },
        { type: "travel", sumest: 0, sumact: 0 }
      ]
    });
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadCostOverview);
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
