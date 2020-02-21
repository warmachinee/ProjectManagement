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

export interface BudgetCostProps {}

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

const BudgetCost: React.FC<BudgetCostProps> = () => {
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
  const [pieMode, setPieMode] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [costData, setCostData] = useState<any | null>(null);
  const [costSum, setCostSum] = useState<any | null>(0);
  const [costProfit, setCostProfit] = useState<any | null>(0);

  function chartLegends() {
    const thisBudget = data.projectcost.projectcost;
    const costPercent = (
      (_totalFromArrayObj(costData, "value", {
        key: "status",
        value: "cost"
      }) /
        thisBudget) *
      100
    ).toFixed(1);
    const costRaw = _thousandSeperater(
      _totalFromArrayObj(costData, "value", {
        key: "status",
        value: "cost"
      })
    );
    const profitPercent =
      costProfit < 0
        ? ((costProfit * 100) / thisBudget).toFixed(1)
        : (
            (_totalFromArrayObj(costData, "value", {
              key: "status",
              value: "profit"
            }) /
              thisBudget) *
            100
          ).toFixed(1);
    const profitRaw =
      costProfit < 0
        ? _thousandSeperater(costProfit)
        : _thousandSeperater(
            _totalFromArrayObj(costData, "value", {
              key: "status",
              value: "profit"
            })
          );

    return (
      <div className={classes.legends}>
        <DotLegends
          label={`Cost (${costPercent})%`}
          secondaryLabel={`${costRaw}฿`}
          backgroundColor={red[600]}
        />
        <DotLegends
          label={`Profit (${profitPercent})%`}
          secondaryLabel={`${profitRaw}฿`}
          backgroundColor={green[600]}
        />
      </div>
    );
  }

  function setChartData(d: any) {
    const list = d.detail;
    const thisPieChartData = [];
    const keys = pieMode ? "sumest" : "sumact";
    for (let i in list) {
      if (list[i][keys]) {
        if (list[i].type !== "managementfee") {
          thisPieChartData.push({
            id: list[i].type,
            label: _capitalizeFirstLetter(list[i].type),
            value: list[i][keys],
            status: "cost"
          });
        }
      }
    }
    if (d.projectcost.op) {
      thisPieChartData.push({
        id: "Operation",
        label: "Operation",
        value: d.projectcost.op,
        status: "cost"
      });
    }
    const realMF = list.filter((item: any) => item.type === "managementfee")[0];
    if (realMF[keys]) {
      thisPieChartData.push({
        id: "Management Fee",
        label: "Management Fee",
        value: realMF[keys],
        status: "cost"
      });
    }
    if (d.projectcost.mf) {
      thisPieChartData.push({
        id: `Management Fee ${
          realMF[keys] < d.projectcost.mf ? "Profit" : "Loss"
        }`,
        label: `Management Fee ${
          realMF[keys] < d.projectcost.mf ? "Profit" : "Loss"
        }`,
        value: Math.abs(realMF[keys] - d.projectcost.mf),
        status: realMF[keys] < d.projectcost.mf ? "profit" : "cost"
      });
    }
    const thisSum = _totalFromArray(thisPieChartData, "value");
    const thisProfit = d.projectcost.projectcost - thisSum;
    if (thisProfit > 0) {
      thisPieChartData.push({
        id: "Profit",
        label: "Profit",
        value: d.projectcost.projectcost - thisSum,
        status: "profit"
      });
      if (d.projectcost.guarantee_percent) {
        thisPieChartData.push({
          id: "Guarantee",
          label: "Guarantee",
          value:
            (d.projectcost.guarantee_percent * d.projectcost.projectcost) / 100,
          status: "profit"
        });
      }
    }
    setCostData(
      thisPieChartData.filter((f: any) => {
        return Boolean(parseFloat(((f.value / thisSum) * 100).toFixed(1)));
      })
    );
    setCostSum(thisSum);
    setCostProfit(thisProfit);
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
    setData(response);
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
        ownername: "EGAT",
        entertain_est: 2000000,
        travel_est: 750000,
        totalest: 23820000,
        totalact: 17432500
      },
      detail: [
        { type: "hardware", sumest: 1310500, sumact: 1015500 },
        { type: "software", sumest: 3024500, sumact: 2522000 },
        { type: "customization", sumest: 12360000, sumact: 10000000 },
        { type: "training", sumest: 1260000, sumact: 1200000 },
        { type: "managementfee", sumest: 3010000, sumact: 2595000 },
        { type: "entertain", sumest: 2000000, sumact: 0 },
        { type: "travel", sumest: 750000, sumact: 0 },
        { type: "other", sumest: 105000, sumact: 100000 }
      ]
    };
    setChartData(thisData);
    setData(thisData);
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadCost);
  }, []);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [pieMode]);

  return (
    <Paper elevation={2} className={classes.root}>
      <Typography variant="h6" align="center">
        {pieMode ? "Chart from estimate cost" : "Chart from actual cost"}
      </Typography>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
      </div>
      <div className={classes.pieChart}>
        {costData && costSum && (
          <ResponsivePie
            data={costData}
            radialLabel={d => `${d.label}`}
            sliceLabel={d => `${((d.value / costSum) * 100).toFixed(1)}%`}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            borderWidth={1}
            borderColor={{ theme: "grid.line.stroke" }}
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
            onClick={d => console.log(d)}
          />
        )}
      </div>
      {costData && costSum && data && chartLegends()}
    </Paper>
  );
};
export default BudgetCost;
