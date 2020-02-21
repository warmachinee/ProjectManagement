import React, { useState, useContext, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { green, red, grey, amber, blue } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Paper, Button } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import AppType from "apptype";
import ChartTooltip from "../ChartTooltip";

const chartRect = { width: 600, height: 500, padding: 16 };

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    margin: "0 auto",
    maxWidth: 1200
  },
  chart: { height: chartRect.height, width: "auto" },
  legends: {
    position: "absolute",
    bottom: 16,
    width: `calc(100% - ${chartRect.padding * 2}px)`,
    display: "flex",
    justifyContent: "center"
  }
}));

export interface BudgetPersonProps {}

const defs = [
  {
    id: "fail",
    type: "patternDots",
    color: red[400],
    size: 1,
    padding: 0
  },
  {
    id: "complete",
    type: "patternDots",
    color: green[400],
    size: 1,
    padding: 0
  },
  {
    id: "inprogress",
    type: "patternDots",
    color: amber[300],
    size: 1,
    padding: 0
  },
  {
    id: "pending",
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

function getStatus(data: any) {
  let variant = "";
  switch (data.status) {
    case "complete":
      variant = "complete";
      break;
    case "fail":
      variant = "fail";
      break;
    case "pending":
    case "inprogress":
      variant = "inprogress";
      break;
    case "pending":
      variant = "pending";
      break;
  }
  return {
    match: {
      id: data.id
    },
    id: variant
  };
}

const DotLegends: React.FC<any> = ({ backgroundColor, label }) => {
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
      <Typography variant="body2">{label}</Typography>
    </div>
  );
};

const BudgetPerson: React.FC<BudgetPersonProps> = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    apiUrl,
    fetchPost,
    _onLocalhostFn,
    _totalFromArray,
    _thousandSeperater,
    sess,
    userid,
    userList
  } = useContext(AppContext);
  const [data, setData] = useState<any>([]);
  const [sum, setSum] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  function setChartData(d: any) {
    const list = d;
    console.log(list);
    const chartData = [];
    for (let i in list) {
      if (list[i].sumpj) {
        chartData.push({
          id: list[i].fullname,
          label: list[i].fullname,
          fullname: `${list[i].fullname} ${list[i].lastname}`,
          value: list[i].sumpj,
          rawData: list[i]
        });
      }
    }
    const thisSum = _totalFromArray(d, "sumpj");
    setData(
      chartData.filter((f: any) => {
        return Boolean(parseFloat(((f.value / thisSum) * 100).toFixed(1)));
      })
    );
    setSum(thisSum);
  }

  useEffect(() => {
    if (userList) {
      setChartData(userList);
    }
  }, [userList]);

  return (
    <Paper elevation={2} className={classes.root}>
      <Typography variant="h6" align="center">
        Budget-Person
      </Typography>
      <div className={classes.chart}>
        {data && (
          <ResponsivePie
            data={data}
            sortByValue={true}
            radialLabel={d => `${d.id}`}
            sliceLabel={d => `${((d.value / sum) * 100).toFixed(0)}%`}
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
            radialLabelsLinkColor={"black"}
            slicesLabelsTextColor={grey[900]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            tooltip={d => {
              return (
                <ChartTooltip
                  data={{
                    label: d.fullname,
                    value: d.value
                  }}
                />
              );
            }}
            theme={chartTheme}
            onClick={d => setSelectedProject(d.rawData)}
            legends={[
              {
                anchor: "right",
                direction: "column",
                translateX: 0,
                itemWidth: 100,
                itemHeight: 36,
                itemTextColor: theme.palette.text.primary,
                symbolSize: 18,
                symbolShape: "circle"
              }
            ]}
          />
        )}
      </div>
      {sum && (
        <div className={classes.legends}>
          <Typography variant="body1" style={{ marginRight: 16 }}>
            Total Budget
          </Typography>
          <Typography
            variant="body1"
            style={{ color: theme.palette.grey[900], fontWeight: 700 }}
          >
            {_thousandSeperater(sum)} ฿
          </Typography>
        </div>
      )}
    </Paper>
  );
};
export default BudgetPerson;
