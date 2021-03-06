import * as React from "react";
import { BehaviorName } from "oni-save-parser";

import { Trans } from "react-i18next";

import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export interface BehaviorChoice {
  name: string;
  behavior: BehaviorName<any>;
}

export interface BehaviorChooserDialogProps {
  title: string;
  applyText: string;
  open: boolean;
  choices: BehaviorChoice[];
  onApply(behaviors: string[]): void;
  onCancel(): void;
}
type Props = BehaviorChooserDialogProps;
const BehaviorChooserDialog: React.FC<Props> = ({
  title,
  applyText,
  open,
  choices,
  onApply,
  onCancel
}) => {
  const [selectedTargets, setSelectedTargets] = React.useState<string[]>([]);
  const onCheckboxChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        // Add item
        setSelectedTargets([...selectedTargets, e.target.value]);
      } else {
        // Remove item
        setSelectedTargets(selectedTargets.filter(x => x !== e.target.value));
      }
    },
    [setSelectedTargets]
  );
  const onApplyClick = React.useCallback(() => {
    onApply(selectedTargets);
  }, [selectedTargets]);
  return (
    <Dialog open={open} airia-labeledby="behavior-chooser-dialog-title">
      {open && (
        <React.Fragment>
          <DialogTitle id="behavior-chooser-dialog-title">{title}</DialogTitle>
          <DialogContent>
            {choices.map(({ name, behavior }) => (
              <FormControlLabel
                key={behavior}
                control={
                  <Checkbox
                    checked={selectedTargets.indexOf(behavior) !== -1}
                    value={behavior}
                    onChange={onCheckboxChange}
                    color="primary"
                  />
                }
                label={name}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>
              <Trans i18nKey="dialog.verbs.cancel_titlecase">Cancel</Trans>
            </Button>
            <Button onClick={onApplyClick} autoFocus>
              {applyText}
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default BehaviorChooserDialog;
