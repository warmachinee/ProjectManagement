import React, { useContext, useEffect } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { TableContainer, Table, Typography } from "@material-ui/core";
import HardwareSoftwareHead from "./HardwareSoftwareHead";
import HardwareSoftwareBody from "./HardwareSoftwareBody";

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export interface HardwareSoftwareProps {
  costType: string;
}

const HardwareSoftware: React.FC<HardwareSoftwareProps> = ({ costType }) => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,
    _onLocalhostFn,
    projectid,
    useConfirmDeleteItem,
    setCostData,
    handleLoadCost
  } = useContext(AppContext);
  const [
    { confirmState, item: costOnDelete },
    onDeleteCost
  ] = useConfirmDeleteItem();

  const passingProps: any = {
    ...useContext(AppContext),
    onDeleteCost,
    handleMoveCost
  };

  async function handleDeleteCost() {
    if (costOnDelete) {
      console.log({ action: "delete", projectid, costid: costOnDelete.costid });
      const response = await fetchPost({
        url: apiUrl("costmanagement"),
        body: { action: "delete", projectid, costid: costOnDelete.costid }
      });
      if (response.status === "success") {
        onDeleteCost({ action: "cancel" });
      }
      await handleLoadCost();
    }
  }

  async function handleMoveCost(current: any, target: any) {
    console.log({
      action: "move",
      type: costType,
      projectid,
      selectseq: current.sequence,
      movetoseq: target.sequence
    });
    const response = await fetchPost({
      url: apiUrl("costmanagement"),
      body: {
        action: "move",
        type: costType,
        projectid,
        selectseq: current.sequence,
        movetoseq: target.sequence
      }
    });
    await handleLoadCost();
  }

  function handleFetchTemp() {
    setCostData([
      {
        costid: 2275482,
        content: "Server",
        estimate_value: 525000,
        actual_value: 20000,
        unit: "",
        amount: 0,
        price: 0
      },
      {
        costid: 8512603,
        content: "HDD",
        estimate_value: 52500,
        actual_value: 52000,
        unit: "",
        amount: 0,
        price: 0
      },
      {
        costid: 2091955,
        content: "Monitor",
        estimate_value: 72000,
        actual_value: 70500,
        unit: "",
        amount: 0,
        price: 0
      },
      {
        costid: 6964514,
        content: "Mouse",
        estimate_value: 32500,
        actual_value: 31000,
        unit: "",
        amount: 0,
        price: 0
      },
      {
        costid: 6950358,
        content: "MAC Book",
        estimate_value: 250000,
        actual_value: 245000,
        unit: "",
        amount: 0,
        price: 0
      },
      {
        costid: 4409256,
        content: "PC",
        estimate_value: 315000,
        actual_value: 300000,
        unit: "",
        amount: 0,
        price: 0
      }
    ]);
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadCost);
  }, [costType]);

  return (
    <AppContext.Provider value={passingProps}>
      <TableContainer>
        <Table stickyHeader>
          <HardwareSoftwareHead />
          <HardwareSoftwareBody />
        </Table>
      </TableContainer>
      <ConfirmDialog
        type="delete"
        open={confirmState}
        onClose={() => onDeleteCost({ action: "cancel" })}
        onCancel={() => onDeleteCost({ action: "cancel" })}
        onSubmit={handleDeleteCost}
        title="Are you sure you want to delete ?"
      >
        <Typography variant="h6" style={{ fontWeight: 400 }} align="center">
          {costOnDelete && costOnDelete.content}
        </Typography>
      </ConfirmDialog>
    </AppContext.Provider>
  );
};
export default HardwareSoftware;
