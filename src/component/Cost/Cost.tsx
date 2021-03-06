import React, { useState, useEffect, useContext, useReducer } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Paper, Chip, Button } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import AppType from "apptype";

const CreateCost = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'CreateCost' */ "./CreateCost/CreateCost"),
  loading: () => null
});

const CostOverview = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'CostOverview' */ "./CostOverview/CostOverview"
    ),
  loading: () => null
});

const Customization = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'Customization' */ "./Customization/Customization"
    ),
  loading: () => null
});

const HardwareSoftware = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'HardwareSoftware' */ "./HardwareSoftware/HardwareSoftware"
    ),
  loading: () => null
});

const Training = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'Training' */ "./Training/Training"),
  loading: () => null
});

const ManagementFee = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ManagementFee' */ "./ManagementFee/ManagementFee"
    ),
  loading: () => null
});

const EntertainTravel = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'EntertainTravel' */ "./EntertainTravel/EntertainTravel"
    ),
  loading: () => null
});

const GeneralDialog = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'GeneralDialog' */ "../Dialog/GeneralDialog"),
  loading: () => null
});

const useStyles = makeStyles(theme => ({
  tableToolbar: {
    padding: theme.spacing(2, 1, 0.5, 2)
  },
  chip: { margin: theme.spacing(0.5) }
}));

export interface CostProps {
  setMaxWidth: React.Dispatch<any>;
}

const costTypeArr = [
  { value: "overview", label: "Overview" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "training", label: "Training" },
  { value: "managementfee", label: "Management Fee" },
  { value: "entertain", label: "Entertain" },
  { value: "travel", label: "Travel" },
  { value: "customization", label: "Customization" },
  { value: "other", label: "Other" }
];

const CostController: React.FC<any> = ({ create, costType, setCostType }) => {
  const classes = useStyles();
  const { booleanDispatch, sess } = useContext(AppContext);

  return (
    <Toolbar className={classes.tableToolbar}>
      <div>
        {costTypeArr.map(d => (
          <Chip
            className={classes.chip}
            key={d.value}
            label={d.label}
            color="primary"
            variant={costType === d.value ? "default" : "outlined"}
            onClick={() => setCostType(d.value)}
          />
        ))}
        <div style={{ marginTop: 16, padding: "4px 0" }}>
          {sess.type === "user" &&
            costType !== "overview" &&
            costType !== "entertain" &&
            costType !== "travel" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => booleanDispatch({ type: "true", key: "create" })}
              >
                Add cost
              </Button>
            )}
        </div>
      </div>
    </Toolbar>
  );
};

const Cost: React.FC<CostProps> = ({ setMaxWidth }) => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    booleanReducer,
    projectid,
    sess,
    userid
  } = useContext(AppContext);
  const [{ create }, booleanDispatch] = useReducer<
    React.Reducer<AppType.BooleanReducerState, AppType.BooleanReducerActions>
  >(booleanReducer, {
    create: false
  });
  const [costType, setCostType] = useState("overview");
  const [costData, setCostData] = useState<any | null>(null);

  function getComponent() {
    switch (costType) {
      case "overview":
        return <CostOverview {...{ costType }} />;
      case "hardware":
      case "software":
      case "other":
        return <HardwareSoftware {...{ costType }} />;
      case "customization":
        return <Customization {...{ costType }} />;
      case "training":
        return <Training {...{ costType }} />;
      case "managementfee":
        return <ManagementFee {...{ costType }} />;
      case "entertain":
      case "travel":
        return <EntertainTravel {...{ costType }} />;
      default:
        return null;
    }
  }

  function getCreateComponent() {
    switch (costType) {
      case "entertain":
      case "travel":
        return null;
      default:
        return <CreateCost {...{ costType }} />;
    }
  }

  function getLabel() {
    return costTypeArr.filter(item => {
      return item.value === costType;
    })[0].label;
  }

  const passingProps: any = {
    ...useContext(AppContext),
    costType,
    setCostType,
    booleanDispatch,
    costData,
    setCostData,
    handleLoadCost
  };

  async function handleLoadCost() {
    const response: any = await fetchPost({
      url: apiUrl("loadproject"),
      body: {
        action: "cost",
        projectid,
        type: costType,
        ...(sess.type === "manager" && userid && { userid })
      }
    });
    setCostData(response);
  }

  useEffect(() => {
    switch (costType) {
      case "customization":
        setMaxWidth(1500);
        break;
      default:
        setMaxWidth(1300);
        break;
    }
  }, [costType]);

  return (
    <AppContext.Provider value={passingProps}>
      <Paper elevation={2}>
        <CostController {...{ create, costType, setCostType }} />
        {getComponent()}
      </Paper>
      <GeneralDialog
        open={create}
        onClose={() => booleanDispatch({ type: "false", key: "create" })}
        title={`Add ${getLabel()} cost`}
      >
        {getCreateComponent()}
      </GeneralDialog>
    </AppContext.Provider>
  );
};
export default Cost;
