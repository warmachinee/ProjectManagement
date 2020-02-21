import React, { useState, useContext, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { green, red, grey, blue } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  Button,
  IconButton,
  ListItemText
} from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import AppType from "apptype";
import {
  InsertChart,
  BarChart,
  PieChart,
  PieChartOutlined
} from "@material-ui/icons";
import ChartTooltip from "../ChartTooltip";

const chartRect = { width: 600, height: 400, padding: 16 };

const useStyles = makeStyles(theme => ({
  root: {
    padding: chartRect.padding,
    position: "relative",
    margin: 8
  },
  chart: { height: chartRect.height, width: "auto" },
  pieChart: { height: 500, width: "auto" },
  legends: {
    position: "absolute",
    bottom: 16,
    width: `calc(100% - ${chartRect.padding * 2}px)`,
    display: "flex",
    justifyContent: "center"
  }
}));

export interface EstimateActualProps {}

const defs = [
  {
    id: "cost",
    type: "patternDots",
    color: red[400],
    size: 1,
    padding: 0
  },
  {
    id: "profit",
    type: "patternDots",
    color: green[400],
    size: 1,
    padding: 0
  },
  {
    id: "remain",
    type: "patternDots",
    color: grey[400],
    size: 1,
    padding: 0
  }
];

const chartTheme = {
  legends: {
    text: {
      fontSize: 16,
      fontFamily: "Roboto"
    }
  },
  labels: {
    text: {
      fontSize: 14,
      fontFamily: "Roboto"
    }
  }
};

function getCostStatus(data: any) {
  let variant = "";
  switch (data.status) {
    case "cost":
      variant = "cost";
      break;
    case "profit":
      variant = "profit";
      break;
    case "remain":
      variant = "remain";
      break;
    default:
      variant = "remain";
  }
  return {
    match: {
      id: data.id
    },
    id: variant
  };
}

function getStatus(data: any) {
  let variant = "";
  switch (data.status) {
    case "complete":
      variant = "complete";
      break;
    case "fail":
      variant = "fail";
      break;
  }
  return {
    match: {
      id: data.id
    },
    id: variant
  };
}

const DotLegends: React.FC<any> = ({
  backgroundColor,
  label,
  secondaryLabel
}) => {
  return (
    <div style={{ alignItems: "center", display: "flex", marginRight: 16 }}>
      <div
        style={{
          height: 16,
          width: 16,
          borderRadius: "50%",
          backgroundColor,
          marginRight: 8
        }}
      />
      <ListItemText primary={label} secondary={secondaryLabel} />
    </div>
  );
};

const EstimateActual: React.FC<EstimateActualProps> = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    apiUrl,
    fetchPost,
    projectid,
    _onLocalhostFn,
    _thousandSeperater,
    _totalFromArray,
    _totalFromArrayObj,
    _capitalizeFirstLetter,
    sess,
    userid
  } = useContext(AppContext);
  const [groupMode, setGroupMode] = useState(false);
  const [pieMode, setPieMode] = useState(false);
  const [costData, setCostData] = useState<any | null>(null);
  const [data, setData] = useState<any | null>([]);
  const [sum, setSum] = useState(0);

  function setChartData(d: any) {
    const list = d.detail;
    const thisChartData = [];
    for (let i in list) {
      thisChartData.push({
        type: list[i].type,
        estimate: list[i].sumest,
        actual: list[i].sumact,
        profit:
          list[i].type === "entertain" || list[i].type === "travel"
            ? 0
            : list[i].sumest - list[i].sumact
      });
    }
    setData(thisChartData);
    const thisPieChartData = [];
    for (let i in list) {
      if (list[i].sumact) {
        if (list[i].type !== "managementfee") {
          thisPieChartData.push({
            id: list[i].type,
            label: _capitalizeFirstLetter(list[i].type),
            value: list[i].sumact,
            estimate: list[i].sumest,
            status: "cost",
            rawData: list[i]
          });
        }
      }
    }
    if (d.projectcost.op) {
      thisPieChartData.push({
        id: "Operation",
        label: "Operation",
        value: d.projectcost.op,
        estimate: d.projectcost.op,
        status: "cost",
        rawData: d.projectcost.op
      });
    }
    const realMF = list.filter((item: any) => item.type === "managementfee")[0];
    if (realMF.sumact) {
      thisPieChartData.push({
        id: "Management Fee",
        label: "Management Fee",
        value: realMF.sumact,
        estimate: realMF.sumact,
        status: "cost",
        rawData: realMF.sumact
      });
    }
    if (d.projectcost.mf) {
      thisPieChartData.push({
        id: `Management Fee ${
          realMF.sumact < d.projectcost.mf ? "Profit" : "Loss"
        }`,
        label: `Management Fee ${
          realMF.sumact < d.projectcost.mf ? "Profit" : "Loss"
        }`,
        value: Math.abs(realMF.sumact - d.projectcost.mf),
        estimate: Math.abs(realMF.sumact - d.projectcost.mf),
        status: realMF.sumact < d.projectcost.mf ? "profit" : "cost",
        rawData: Math.abs(realMF.sumact - d.projectcost.mf)
      });
    }

    if (d.projectcost.guarantee_percent) {
      thisPieChartData.push({
        id: "Guarantee",
        label: "Guarantee",
        value:
          (d.projectcost.guarantee_percent * d.projectcost.projectcost) / 100,
        estimate:
          (d.projectcost.guarantee_percent * d.projectcost.projectcost) / 100,
        status: "profit",
        rawData:
          (d.projectcost.guarantee_percent * d.projectcost.projectcost) / 100
      });
    }

    thisPieChartData.push({
      id: "Profit",
      label: "Profit",
      value:
        d.projectcost.projectcost - _totalFromArray(thisPieChartData, "value"),
      estimate:
        d.projectcost.projectcost - _totalFromArray(thisPieChartData, "value"),
      status: "profit",
      rawData:
        d.projectcost.projectcost - _totalFromArray(thisPieChartData, "value")
    });
    const thisSum = _totalFromArray(thisPieChartData, "value");
    setCostData(
      thisPieChartData.filter((f: any) => {
        return Boolean(parseFloat(((f.value / thisSum) * 100).toFixed(1)));
      })
    );
    setSum(thisSum);
  }

  async function handleLoadCost() {
    const response: any | AppType.CostOverview = await fetchPost({
      url: apiUrl("loadproject"),
      body: {
        action: "costoverview",
        projectid,
        ...(sess.type === "manager" && userid && { userid })
      }
    });
    setChartData(response);
  }

  function handleFetchTemp() {
    const thisData = {
      projectcost: {
        projectid: 9422312,
        projectname: "Energy Project",
        projectcost: 27000000,
        op: 2349000,
        op_percent: 8.7,
        mf: 1350000,
        mf_percent: 5,
        guarantee_percent: 5,
        guarantee_period: 0,
        contractbegin: "2020-02-28T17:00:00.000Z",
        ownername: null,
        totalest: 2656000,
        totalact: 1015650
      },
      detail: [
        { type: "hardware", sumest: 1036000, sumact: 1015500 },
        { type: "software", sumest: 0, sumact: 0 },
        { type: "customization", sumest: 1050000, sumact: 0 },
        { type: "training", sumest: 170000, sumact: 0 },
        { type: "managementfee", sumest: 400000, sumact: 150 },
        { type: "entertain", sumest: 0, sumact: 0 },
        { type: "travel", sumest: 0, sumact: 0 }
      ]
    };
    setChartData(thisData);
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadCost);
  }, []);

  return (
    <Paper elevation={2} className={classes.root}>
      <Typography variant="h6" align="center">
        Project cost
      </Typography>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={() => setGroupMode((prev: any) => !prev)}
          startIcon={
            groupMode ? (
              <InsertChart fontSize="large" />
            ) : (
              <BarChart fontSize="large" />
            )
          }
        >
          Toggle
        </Button>
      </div>
      <div className={classes.chart} style={{ maxWidth: 1200, margin: "auto" }}>
        {data && (
          <ResponsiveBar
            data={data}
            keys={
              groupMode
                ? ["actual", "profit"]
                : ["estimate", "actual", "profit"]
            }
            colors={
              groupMode
                ? [red[400], green[400]]
                : [blue[400], red[400], green[400]]
            }
            indexBy="type"
            margin={{ top: 50, right: 130, bottom: 50, left: 130 }}
            padding={0.4}
            groupMode={groupMode ? "stacked" : "grouped"}
            borderRadius={2}
            borderColor={theme.palette.text.primary}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendPosition: "middle",
              legendOffset: 32,
              format: value => `${_capitalizeFirstLetter(value)}`
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendPosition: "start",
              legendOffset: -40,
              format: value => `${_thousandSeperater(value)} ฿`
            }}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: theme.palette.text.primary,
                    fontSize: 14
                  }
                }
              }
            }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={theme.palette.grey[900]}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                itemTextColor: theme.palette.text.primary,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            tooltip={d => {
              return (
                <ChartTooltip
                  data={{ label: _capitalizeFirstLetter(d.id), value: d.value }}
                />
              );
            }}
          />
        )}
      </div>
      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          color="primary"
          variant="outlined"
          size="large"
          onClick={() => setPieMode((prev: any) => !prev)}
          startIcon={
            pieMode ? (
              <PieChartOutlined fontSize="large" />
            ) : (
              <PieChart fontSize="large" />
            )
          }
        >
          Toggle
        </Button>
      </div> */}

      <div className={classes.pieChart}>
        {costData && (
          <ResponsivePie
            data={costData}
            radialLabel={d => `${d.label}`}
            sliceLabel={d => `${((d.value / sum) * 100).toFixed(1)}%`}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            borderWidth={1}
            borderColor={{ theme: "grid.line.stroke" }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor={theme.palette.text.primary}
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={theme.palette.text.primary}
            slicesLabelsTextColor={grey[900]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            defs={defs}
            fill={costData.map((d: any) => {
              return getCostStatus(d);
            })}
            tooltip={d => {
              return <ChartTooltip data={d} />;
            }}
            theme={chartTheme}
          />
        )}
      </div>
      {costData && sum && (
        <div className={classes.legends}>
          <DotLegends
            label={`Cost (${(
              (_totalFromArrayObj(costData, "value", {
                key: "status",
                value: "cost"
              }) /
                sum) *
              100
            ).toFixed(1)})%`}
            secondaryLabel={`${_thousandSeperater(
              _totalFromArrayObj(costData, "value", {
                key: "status",
                value: "cost"
              })
            )}฿`}
            backgroundColor={red[600]}
          />
          <DotLegends
            label={`Profit (${(
              (_totalFromArrayObj(costData, "value", {
                key: "status",
                value: "profit"
              }) /
                sum) *
              100
            ).toFixed(1)})%`}
            secondaryLabel={`${_thousandSeperater(
              _totalFromArrayObj(costData, "value", {
                key: "status",
                value: "profit"
              })
            )}฿`}
            backgroundColor={green[600]}
          />
        </div>
      )}
    </Paper>
  );
};
export default EstimateActual;
