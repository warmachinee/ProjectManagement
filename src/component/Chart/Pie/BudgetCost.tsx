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
    let thisPieChartData = [];
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
    const thisProfit =
      d.projectcost.projectcost - _totalFromArray(thisPieChartData, "value");
    if (thisProfit > 0) {
      thisPieChartData.push({
        id: "Profit",
        label: "Profit",
        value:
          d.projectcost.projectcost -
          _totalFromArray(thisPieChartData, "value"),
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
    const thisSum = _totalFromArray(thisPieChartData, "value");
    const lastArrData = thisPieChartData.filter((f: any) => {
      return Boolean(parseFloat(((f.value / thisSum) * 100).toFixed(1)));
    });
    setCostData(
      thisProfit < 0
        ? lastArrData.map(d => {
            return { ...d, status: "cost" };
          })
        : lastArrData
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

  useEffect(() => {
    handleLoadCost();
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
