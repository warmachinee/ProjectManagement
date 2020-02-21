import React, { useContext, useEffect } from "react";
import Loadable from "react-loadable";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { Typography, TableContainer, Table } from "@material-ui/core";
import CustomizationHead from "./CustomizationHead";
import CustomizationBody from "./CustomizationBody";

const ConfirmDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConfirmDialog' */ "../../Dialog/ConfirmDialog"
    ),
  loading: () => null
});

const useStyles = makeStyles(theme => ({}));

export interface CustomizationProps {
  costType: string;
}

const Customization: React.FC<CustomizationProps> = ({ costType }) => {
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
        costid: 8087854,
        content: "Installing",
        estimate_value: 0,
        actual_value: 0,
        educational: "Master Degree",
        experience: "2 Years",
        salary: 0,
        man: 0,
        manmonth: 0
      },
      {
        costid: 4307000,
        content: "Editing",
        estimate_value: 0,
        actual_value: 0,
        educational: "Master Degree",
        experience: "5 Years",
        salary: 0,
        man: 0,
        manmonth: 0
      }
    ]);
  }

  useEffect(() => {
    _onLocalhostFn(handleFetchTemp, handleLoadCost);
  }, []);

  return (
    <AppContext.Provider value={passingProps}>
      <TableContainer>
        <Table stickyHeader>
          <CustomizationHead />
          <CustomizationBody />
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
export default Customization;
