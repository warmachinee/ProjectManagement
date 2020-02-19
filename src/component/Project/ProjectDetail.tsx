import React, { useContext, useEffect, useState, useRef } from "react";
import NumberFormat from "react-number-format";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  InputAdornment
} from "@material-ui/core";
import { AppContext } from "../../AppContext";
import AppType from "apptype";

const useStyles = makeStyles(theme => ({
  textField: { marginBottom: 12 },
  label: { marginBottom: 12, marginTop: 8 },
  flexGrid: { display: "flex", marginBottom: 12 }
}));

export interface ProjectDetailProps {}

const SelectProjectType: React.FC<any> = props => {
  const classes = useStyles();
  const { type, setType } = props;
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl fullWidth variant="outlined" className={classes.textField}>
      <InputLabel ref={inputLabel}>Project type</InputLabel>
      <Select
        value={type}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          setType(e.target.value)
        }
        labelWidth={labelWidth}
      >
        <MenuItem value={1}>Normal</MenuItem>
        <MenuItem value={2}>Maintenance assistant</MenuItem>
      </Select>
    </FormControl>
  );
};

const SelectProjectStatus: React.FC<any> = props => {
  const classes = useStyles();
  const { status, setStatus } = props;
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl fullWidth variant="outlined" className={classes.textField}>
      <InputLabel ref={inputLabel}>Status</InputLabel>
      <Select
        value={status}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          setStatus(e.target.value)
        }
        labelWidth={labelWidth}
      >
        <MenuItem value={"inprogress"}>Inprogress</MenuItem>
        <MenuItem value={"pending"}>Pending</MenuItem>
        <MenuItem value={"pm"}>PM</MenuItem>
        <MenuItem value={"complete"}>Complete</MenuItem>
        <MenuItem value={"fail"}>Fail</MenuItem>
      </Select>
    </FormControl>
  );
};

const SelectProjectStage: React.FC<any> = props => {
  const classes = useStyles();
  const { stage, setStage } = props;
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl fullWidth variant="outlined" className={classes.textField}>
      <InputLabel ref={inputLabel}>Stage</InputLabel>
      <Select
        value={stage}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          setStage(e.target.value)
        }
        labelWidth={labelWidth}
      >
        <MenuItem value={1}>Proposal</MenuItem>
        <MenuItem value={2}>Contract</MenuItem>
        <MenuItem value={3}>Implement</MenuItem>
        <MenuItem value={4}>PM</MenuItem>
      </Select>
    </FormControl>
  );
};

const SelectProjectPotential: React.FC<any> = props => {
  const classes = useStyles();
  const { potential, setPotential } = props;
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl fullWidth variant="outlined" className={classes.textField}>
      <InputLabel ref={inputLabel}>Potential</InputLabel>
      <Select
        value={potential}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          setPotential(e.target.value)
        }
        labelWidth={labelWidth}
      >
        <MenuItem value={"LOW"}>Low</MenuItem>
        <MenuItem value={"MEDIUM"}>Medium</MenuItem>
        <MenuItem value={"HIGH"}>High</MenuItem>
      </Select>
    </FormControl>
  );
};

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

interface State {
  projectcost: string;
  guarantee_period: any;
}

interface Percent {
  op_percent: any;
  mf_percent: any;
  guarantee_percent: any;
}

const ProjectDetail: React.FC<ProjectDetailProps> = () => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    project,
    useForm,
    _dateToString,
    booleanReducer,
    _dateToAPI,
    projectid,
    handleLoadProjectDetail,
    _isObjectEmpty
  } = useContext(AppContext);
  const [form, formOnChange, setForm] = useForm({
    projectname: "",
    summary: ""
  });
  const [percent, setPercent] = useState<Percent>({
    op_percent: 0.0,
    mf_percent: 0.0,
    guarantee_percent: 0.0
  });
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [contractbegin, setConstractBegin] = useState(new Date());
  const [type, setType] = useState<AppType.ProjectType | unknown>(1);
  const [stage, setStage] = useState<AppType.ProjectStage | unknown>(1);
  const [status, setStatus] = useState<AppType.ProjectStatus | unknown>(
    "inprogress"
  );
  const [potential, setPotential] = useState<
    AppType.ProjectPotential | unknown
  >("LOW");
  const [values, setValues] = React.useState<State>({
    projectcost: "0",
    guarantee_period: 0
  });
  const data = project.projectdetail;

  function getPercent(number: any) {
    const value = parseFloat(number);
    switch (true) {
      case value > 100:
        return 100;
      case value < 0:
        return 0;
      case value >= 0 && value <= 100:
        return value;
      default:
        return 0;
    }
  }

  const handleChangePercent = (name: keyof Percent) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPercent({
      ...percent,
      [name]: event.target.value
    });
  };
  
  const handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value
    });
  };

  function detectPercent(number: any) {
    const val = parseFloat(number);
    return isNaN(val) ? 0 : val;
  }

  function detectPeriod(number: any) {
    const val = parseInt(number);
    return isNaN(val) ? 0 : val;
  }

  function detectChange() {
    const returnedChange = {};
    if (form.projectname !== data.projectname) {
      Object.assign(returnedChange, { projectname: form.projectname });
    }
    if (detectPercent(percent.op_percent) !== data.op_percent) {
      Object.assign(returnedChange, {
        op_percent: getPercent(percent.op_percent)
      });
    }
    if (detectPercent(percent.mf_percent) !== data.mf_percent) {
      Object.assign(returnedChange, {
        mf_percent: getPercent(percent.mf_percent)
      });
    }
    if (detectPercent(percent.guarantee_percent) !== data.guarantee_percent) {
      Object.assign(returnedChange, {
        guarantee_percent: getPercent(percent.guarantee_percent)
      });
    }
    if (
      detectPeriod(values.guarantee_period) !== parseInt(data.guarantee_period)
    ) {
      Object.assign(returnedChange, {
        guarantee_period: detectPeriod(values.guarantee_period)
      });
    }
    if (form.summary !== (data.summary ? data.summary : "")) {
      Object.assign(returnedChange, {
        summary: form.summary,
        boolsummary: "true"
      });
    }
    if (parseInt(values.projectcost) !== data.projectcost) {
      Object.assign(returnedChange, {
        projectcost: isNaN(parseInt(values.projectcost))
          ? 0
          : parseInt(values.projectcost)
      });
    }
    if (_dateToAPI(startdate) !== _dateToAPI(new Date(data.startdate))) {
      Object.assign(returnedChange, { startdate: _dateToAPI(startdate) });
    }
    if (_dateToAPI(enddate) !== _dateToAPI(new Date(data.enddate))) {
      Object.assign(returnedChange, { enddate: _dateToAPI(enddate) });
    }
    if (
      _dateToAPI(contractbegin) !== _dateToAPI(new Date(data.contractbegin))
    ) {
      Object.assign(returnedChange, {
        contractbegin: _dateToAPI(contractbegin)
      });
    }
    if (type !== data.type) {
      Object.assign(returnedChange, { type: type });
    }
    if (stage !== data.stage_current) {
      Object.assign(returnedChange, { stagenow: stage });
    }
    if (status !== data.status) {
      Object.assign(returnedChange, { status: status });
    }
    if (potential !== data.potential) {
      Object.assign(returnedChange, { potential: potential });
    }
    return returnedChange;
  }

  async function handleSave() {
    console.log({ action: "edit", projectid, ...detectChange() });
    const response = await fetchPost({
      url: apiUrl("projectsystem"),
      body: { action: "edit", projectid, ...detectChange() }
    });
    console.log(response);
    await handleLoadProjectDetail();
  }

  function setInitialData() {
    setForm({
      projectname: data.projectname ? data.projectname : "",
      summary: data.summary ? data.summary : ""
    });
    setPercent({
      op_percent: data.op_percent ? data.op_percent : 0,
      mf_percent: data.mf_percent ? data.mf_percent : 0,
      guarantee_percent: data.guarantee_percent ? data.guarantee_percent : 0
    });
    setValues({
      projectcost: data.projectcost ? data.projectcost.toString() : "0",
      guarantee_period: data.guarantee_period ? data.guarantee_period : 0
    });
    setStartDate(data.startdate ? new Date(data.startdate) : new Date());
    setEndDate(data.enddate ? new Date(data.enddate) : new Date());
    setConstractBegin(
      data.contractbegin ? new Date(data.contractbegin) : new Date()
    );
    setType(data.type ? data.type : 1);
    setStage(data.stage_current ? data.stage_current : 1);
    setStatus(data.status ? data.status : "inprogress");
    setPotential(data.potential ? data.potential : "LOW");
  }

  useEffect(() => {
    setInitialData();
  }, []);

  return (
    <div>
      <Typography style={{ marginBottom: 16 }}>
        {`Create Date : ${_dateToString(data.createdate)}`}
      </Typography>
      <SelectProjectType {...{ type, setType }} />
      <TextField
        fullWidth
        className={classes.textField}
        variant="outlined"
        label="Project name"
        name="projectname"
        value={form.projectname}
        onChange={formOnChange}
      />
      <Typography variant="h6" className={classes.label}>
        Budget and Cost
      </Typography>
      <TextField
        fullWidth
        className={classes.textField}
        variant="outlined"
        label="Budget"
        value={values.projectcost}
        onChange={handleChange("projectcost")}
        InputProps={{
          startAdornment: <InputAdornment position="start">฿</InputAdornment>,
          inputComponent: NumberFormatCustom as any
        }}
        onFocus={e => e.target.select()}
      />
      <div className={classes.flexGrid}>
        <TextField
          fullWidth
          variant="outlined"
          label="Operation"
          helperText="Operation Percent"
          type={"number"}
          name="op_percent"
          value={percent.op_percent}
          onChange={handleChangePercent("op_percent")}
          InputProps={{
            endAdornment: <InputAdornment position="start">%</InputAdornment>
          }}
          onFocus={e => e.target.select()}
        />
        <div style={{ width: 8 }} />
        <TextField
          fullWidth
          variant="outlined"
          label="Management Fee"
          helperText="Management Fee Percent"
          type={"number"}
          name="mf_percent"
          value={percent.mf_percent}
          onChange={handleChangePercent("mf_percent")}
          InputProps={{
            endAdornment: <InputAdornment position="start">%</InputAdornment>
          }}
          onFocus={e => e.target.select()}
        />
      </div>
      <Typography variant="h6" className={classes.label}>
        Date
      </Typography>
      <div className={classes.flexGrid}>
        <DatePicker
          autoOk
          fullWidth
          variant="inline"
          inputVariant="outlined"
          label="Start date"
          value={startdate}
          onChange={(date: any) => setStartDate(new Date(date))}
          views={["year", "month", "date"]}
        />
        <div style={{ width: 8 }} />
        <DatePicker
          autoOk
          fullWidth
          variant="inline"
          inputVariant="outlined"
          label="End date"
          value={enddate}
          onChange={(date: any) => setEndDate(new Date(date))}
        />
        <div style={{ width: 8 }} />
        <DatePicker
          autoOk
          fullWidth
          variant="inline"
          inputVariant="outlined"
          label="Contract"
          helperText="Contract start date"
          value={contractbegin}
          onChange={(date: any) => setConstractBegin(new Date(date))}
        />
      </div>
      <Typography variant="h6" className={classes.label}>
        Guarantee
      </Typography>
      <div className={classes.flexGrid}>
        <TextField
          fullWidth
          className={classes.textField}
          variant="outlined"
          label="Percent"
          helperText="Guarantee Percent"
          type={"number"}
          name="guarantee_percent"
          value={percent.guarantee_percent}
          onChange={handleChangePercent("guarantee_percent")}
          InputProps={{
            endAdornment: <InputAdornment position="start">%</InputAdornment>
          }}
          onFocus={e => e.target.select()}
        />
        <div style={{ width: 8 }} />
        <TextField
          fullWidth
          className={classes.textField}
          variant="outlined"
          label="Period"
          helperText="Guarantee Period"
          type={"number"}
          value={values.guarantee_period}
          onChange={handleChange("guarantee_period")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{`Day${
                values.guarantee_period > 1 ? "s" : ""
              }`}</InputAdornment>
            )
          }}
          onFocus={e => e.target.select()}
        />
      </div>
      <Typography variant="h6" className={classes.label}>
        Other
      </Typography>
      <div className={classes.flexGrid}>
        <SelectProjectPotential {...{ potential, setPotential }} />
        <div style={{ width: 8 }} />
        <SelectProjectStatus {...{ status, setStatus }} />
        <div style={{ width: 8 }} />
        <SelectProjectStage {...{ stage, setStage }} />
      </div>
      <Typography variant="h6" className={classes.label}>
        Project Summary
      </Typography>
      <TextField
        fullWidth
        multiline
        rows="6"
        className={classes.textField}
        variant="outlined"
        label="Summary"
        name="summary"
        value={form.summary}
        onChange={formOnChange}
      />
      <Button
        disabled={_isObjectEmpty(detectChange())}
        style={{ width: "100%", marginTop: 12 }}
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSave}
      >
        Save
      </Button>
    </div>
  );
};
export default ProjectDetail;
