import React, { useContext, useEffect } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { TableContainer, Table, Typography } from "@material-ui/core";
import EntertainTravelHead from "./EntertainTravelHead";
import EntertainTravelBody from "./EntertainTravelBody";

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export interface EntertainTravelProps {
  costType: string;
}

const EntertainTravel: React.FC<EntertainTravelProps> = ({ costType }) => {
  const classes = useStyles();
  const {
    apiUrl,
    fetchPost,

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

  useEffect(() => {
    handleLoadCost();
  }, [costType]);

  return (
    <AppContext.Provider value={passingProps}>
      <TableContainer>
        <Table stickyHeader>
          <EntertainTravelHead />
          <EntertainTravelBody />
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
export default EntertainTravel;
