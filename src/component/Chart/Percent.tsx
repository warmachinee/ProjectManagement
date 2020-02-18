import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  green,
  amber,
  teal,
  lightGreen,
  lime,
  yellow,
  orange,
  deepOrange,
  red
} from "@material-ui/core/colors";
import { Typography, Paper, useTheme } from "@material-ui/core";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles(theme => ({
  parent: {
    position: "relative",
    width: 200,
    height: 24,
    backgroundColor: theme.palette.background.default
  },
  percent: {
    position: "absolute",
    height: "100%"
  },
  label: {
    fontWeight: 600,
    position: "absolute",
    width: "100%",
    textAlign: "center"
  }
}));

export interface PercentProps {
  backgroundColor?: string;
  percent: number;
}

const Percent: React.FC<PercentProps> = ({ backgroundColor, percent }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { isDarkMode } = useContext(AppContext);

  function getBackGroundFromPercent() {
    switch (true) {
      case percent > 100:
        return backgroundColor
          ? backgroundColor
          : theme.palette.background.paper;
      case percent < 0:
        return theme.palette.background.default;
      case percent >= 0 && percent <= 100:
        switch (true) {
          case percent === 100:
            return backgroundColor
              ? backgroundColor
              : theme.palette.background.paper;
          case percent >= 90:
            return green[isDarkMode ? 800 : 600];
          case percent >= 80 && percent < 90:
            return green[isDarkMode ? 600 : 400];
          case percent >= 70 && percent < 80:
            return lightGreen[isDarkMode ? 800 : 400];
          case percent >= 60 && percent < 70:
            return lime[isDarkMode ? 800 : 600];
          case percent >= 50 && percent < 60:
            return yellow[isDarkMode ? 900 : 600];
          case percent >= 40 && percent < 50:
            return amber[isDarkMode ? 900 : 600];
          case percent >= 30 && percent < 40:
            return orange[600];
          case percent >= 20 && percent < 30:
            return deepOrange[600];
          case percent >= 10 && percent < 20:
            return red[600];
          case percent < 10:
            return red[900];
          default:
            return theme.palette.background.paper;
        }
      default:
        return backgroundColor
          ? backgroundColor
          : theme.palette.background.default;
    }
  }

  function getWidthFromPercent() {
    switch (true) {
      case percent > 100:
        return `100%`;
      case percent < 0:
        return `0%`;
      case percent >= 0 && percent <= 100:
        return `${percent}%`;
      default:
        return `0%`;
    }
  }

  function getLabelFromPercent() {
    switch (true) {
      case percent >= 100:
        return `Complete`;
      case percent < 0:
        return `0%`;
      case percent >= 0 && percent < 100:
        return `${percent}%`;
      default:
        return `0%`;
    }
  }

  return (
    <Paper elevation={percent >= 100 ? 0 : 3} className={classes.parent}>
      <div
        className={classes.percent}
        style={{
          width: getWidthFromPercent(),
          backgroundColor: getBackGroundFromPercent()
        }}
      ></div>
      <Typography
        className={classes.label}
        align="center"
        style={{
          color: percent >= 100 ? green[600] : theme.palette.text.primary
        }}
      >
        {getLabelFromPercent()}
      </Typography>
    </Paper>
  );
};
export default Percent;
