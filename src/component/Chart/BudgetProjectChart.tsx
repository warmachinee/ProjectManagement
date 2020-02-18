import React from "react";
import Chart from "react-google-charts";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: { maxWidth: 1200, margin: "auto" }
}));

export interface BudgetProjectChartProps {}

const BudgetProjectChart: React.FC<BudgetProjectChartProps> = () => {
  const classes = useStyles();
  const chartData = [
    ["Project", "Budget (in millions)"],
    ["Energy", 20],
    ["Solar", 30],
    ["IT Project", 10],
    ["Project MA", 0.75],
    ["Asset Management", 7]
  ];
  return (
    <Paper className={classes.root}>
      <div style={{ display: "flex" }}>
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: "Budget-Project",
            pieSliceText: "value",
            pieSliceTextStyle: { fontSize: 14 },
            is3D: true
          }}
          rootProps={{ "data-testid": "1" }}
          chartEvents={[
            {
              eventName: "select",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 1) {
                  const [selectedItem] = selection;
                  const dataTable = chartWrapper.getDataTable();
                  const { row } = selectedItem;
                  console.log(chartData[row + 1]);
                }
              }
            }
          ]}
        />
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Topics", "Budget (in millions)"],
            ["Profit", 21.256],
            ["Cost", 58.123]
          ]}
          options={{
            title: "Budget-Profit",
            pieSliceTextStyle: { fontSize: 14 },
            slices: {
              0: { color: green[600] },
              1: { color: grey[500] }
            },
            is3D: true
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
      <Chart
        width={"800px"}
        height={"500px"}
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Cost type", "Estimate", "Actual"],
          ["Software", 3.12, 2.75],
          ["Hardware", 7.12, 5.42],
          ["Customization", 3.1, 4.5],
          ["Training", 1.25, 1.05],
          ["Mangament Fee", 5, 5.2]
        ]}
        options={{
          title: "Estimate and Actual Cost",
          vAxis: { title: "Cost (in millions)" },
          hAxis: { title: "Cost Type" },
          seriesType: "bars",
          series: { 5: { type: "line" } }
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </Paper>
  );
};
export default BudgetProjectChart;
