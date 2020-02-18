import React, { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Avatar,
  Color,
  SvgIconProps
} from "@material-ui/core";

import { Close as CloseIcon, Delete } from "@material-ui/icons";
import { red, blue } from "@material-ui/core/colors";
import AppButton from "../../api/AppButton";

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  avatar: {
    width: "auto",
    height: "auto",
    padding: 12,
    marginBottom: 8
  },
  deleteIcon: { fontSize: 56, color: "white" }
}));

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: string | null;
  actions?: ReactNode;
  headIcon?: (props: SvgIconProps) => JSX.Element;
  headIconColor?: Color;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  dividers?: boolean;
  type: "delete" | "normal";
  submitButtonColor?: Color;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => any;
  onCancel?: () => any;
  other?: any;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = props => {
  const classes = useStyles();
  const {
    open = false,
    onClose,
    children,
    title,
    type,
    headIcon: HeadIcon = Delete,
    headIconColor = red,
    maxWidth = "xs",
    dividers = false,
    submitButtonColor = red,
    submitText = "Delete",
    cancelText = "Cancel",
    onCancel = onClose,
    onSubmit,
    other
  } = props;

  return (
    <Dialog
      scroll="body"
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      {...other}
    >
      <DialogTitle>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={dividers}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            className={classes.avatar}
            style={{ backgroundColor: headIconColor[500] }}
          >
            <HeadIcon className={classes.deleteIcon} />
          </Avatar>
        </div>
        <Typography variant="h6" align="center">
          {title}
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {children}
        </div>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", margin: "16px 0" }}>
        <Button
          size="large"
          style={{ marginRight: 8 }}
          color="primary"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <AppButton
          size="large"
          variant="contained"
          buttonColor={submitButtonColor}
          onClick={onSubmit}
        >
          {submitText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
