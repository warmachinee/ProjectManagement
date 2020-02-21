import React, { useState, useContext, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { green, red, blue } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Paper, Button } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import AppType from "apptype";
import { InsertChart, BarChart } from "@material-ui/icons";
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
    _capitalizeFirstLetter,
    sess,
    userid
  } = useContext(AppContext);
  const [groupMode, setGroupMode] = useState(false);
  const [data, setData] = useState<any | null>([]);
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: theme.palette.text.primary,
          fontSize: 14
        }
      }
    }
  };

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
            minValue={100}
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
            theme={chartTheme}
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
    </Paper>
  );
};
export default EstimateActual;
