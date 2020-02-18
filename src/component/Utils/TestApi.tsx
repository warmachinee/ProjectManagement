import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({}));

export interface TestApiProps {}

const TestApi: React.FC<TestApiProps> = () => {
  const classes = useStyles();
  const { apiUrl, fetchPost } = useContext(AppContext);
  const [form, setForm] = useState<{ [key: string]: any }>({
    api: "",
    action: "",
    p1: { param: "", data: "", type: "" },
    p2: { param: "", data: "", type: "" },
    p3: { param: "", data: "", type: "" },
    p4: { param: "", data: "", type: "" },
    p5: { param: "", data: "", type: "" },
    p6: { param: "", data: "", type: "" },
    p7: { param: "", data: "", type: "" },
    p8: { param: "", data: "", type: "" },
    p9: { param: "", data: "", type: "" },
    p10: { param: "", data: "", type: "" }
  });
  async function handleFetch() {
    const sendObj: any = {};

    for (const key in form) {
      if (
        form[key].param &&
        form[key].param !== "" &&
        form[key].data &&
        form[key].data !== ""
      ) {
        let exportData = form[key].data;
        switch (form[key].type) {
          case "text":
            break;
          case "int":
            exportData = parseInt(exportData);
            break;
          case "float":
            exportData = parseFloat(exportData);
            break;
          default:
            break;
        }

        Object.assign(sendObj, { [form[key].param]: exportData });
      }
    }
    if (form.action !== "") {
      Object.assign(sendObj, { action: form.action });
    }
    const response = await fetchPost({
      url: apiUrl(form.api),
      body: sendObj
    });
    console.log(response);
  }

  function handleOnKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleFetch();
    }
  }

  function handleClearParam() {
    setForm({
      api: form.api,
      action: form.action,
      p1: { param: "", data: "", type: "" },
      p2: { param: "", data: "", type: "" },
      p3: { param: "", data: "", type: "" },
      p4: { param: "", data: "", type: "" },
      p5: { param: "", data: "", type: "" },
      p6: { param: "", data: "", type: "" },
      p7: { param: "", data: "", type: "" },
      p8: { param: "", data: "", type: "" },
      p9: { param: "", data: "", type: "" },
      p10: { param: "", data: "", type: "" }
    });
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <React.Fragment>
      <div style={{ padding: 16, width: 600, margin: "auto" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="api"
          onChange={e => setForm({ ...form, api: e.target.value })}
          onKeyPress={handleOnKeyPress}
        />
        <TextField
          label="Action"
          onChange={e => setForm({ ...form, action: e.target.value })}
          onKeyPress={handleOnKeyPress}
        />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d, i) => (
          <TextFieldTest
            key={d}
            data={d}
            form={form}
            setForm={setForm}
            handleOnKeyPress={handleOnKeyPress}
          />
        ))}
        <Button onClick={handleClearParam}>Clear param</Button>
      </div>
    </React.Fragment>
  );
};
export default TestApi;

function TextFieldTest(props: any) {
  const { data, form, setForm, handleOnKeyPress } = props;
  const [type, setType] = useState("text");

  function formOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [`p${data}`]: {
        ...form[`p${data}`],
        [e.target.name]: e.target.value,
        type: type
      }
    });
  }

  useEffect(() => {
    setForm({
      ...form,
      [`p${data}`]: {
        ...form[`p${data}`],
        type: type
      }
    });
  }, [type]);

  return (
    <div style={{ display: "flex", padding: "8px 0" }}>
      <TextField
        name="param"
        value={form[`p${data}`].param}
        placeholder={`Param ${data}`}
        onChange={formOnChange}
        onKeyPress={handleOnKeyPress}
      />
      <div style={{ width: 16 }} />
      <TextField
        name="data"
        value={form[`p${data}`].data}
        placeholder={`Value ${data}`}
        type={type === "text" ? "text" : "number"}
        onChange={formOnChange}
        onKeyPress={handleOnKeyPress}
      />
      <div style={{ width: 16 }} />
      <FormControl>
        <Select value={type} onChange={e => setType(e.target.value as string)}>
          <MenuItem value={"text"}>Text</MenuItem>
          <MenuItem value={"int"}>Int</MenuItem>
          <MenuItem value={"float"}>Float</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
