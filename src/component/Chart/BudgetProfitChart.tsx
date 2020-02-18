import React from "react";
import Chart from "react-google-charts";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: { maxWidth: 1200, margin: "auto" }
}));

export interface BudgetProfitChartProps {}

const BudgetProfitChart: React.FC<BudgetProfitChartProps> = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div style={{ display: "flex" }}>
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Project", "Budget (in millions)"],
            ["Energy", 20],
            ["Solar", 30],
            ["IT Project", 10],
            ["Project MA", 0.75],
            ["Asset Management", 7]
          ]}
          options={{
            title: "Budget-Project",
            pieSliceText: "value",
            pieSliceTextStyle: { fontSize: 14 }
          }}
          rootProps={{ "data-testid": "1" }}
        />
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Topics", "Budget (in millions)"],
            ["Profit", 41.256],
            ["Cost", 58.123]
          ]}
          options={{
            title: "Budget-Profit",
            pieSliceTextStyle: { fontSize: 14 },
            slices: {
              0: { color: green[600] },
              1: { color: grey[500] }
            }
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    </Paper>
  );
};
export default BudgetProfitChart;
