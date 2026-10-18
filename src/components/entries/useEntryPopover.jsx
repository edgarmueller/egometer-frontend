import React, { useCallback, useState } from "react";
import moment from "moment";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MeterAvatar from "../common/MeterAvatar";
import EntryEditor from "./EntryEditor";

/**
 * An editor of an entry in a popover. Returns the function opening it at
 * an element for a meter and date, and the popover to render.
 */
const useEntryPopover = (meters, entriesByMeter) => {
  const [edited, setEdited] = useState(undefined);
  const openEditor = useCallback(
    (anchor, meter, date) => setEdited({ anchor, meterId: meter.id, date }),
    []
  );
  const meter = edited && meters.find((m) => m.id === edited.meterId);
  const entry =
    meter &&
    (entriesByMeter[meter.id] || []).find((e) => e.date === edited.date);

  const popover = (
    <Popover
      open={meter !== undefined}
      anchorEl={edited && edited.anchor}
      onClose={() => setEdited(undefined)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {meter && (
        <Box sx={{ p: 2, width: { xs: 300, sm: 380 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <MeterAvatar meter={meter} size={32} />
            <Box>
              <Typography variant="subtitle2">{meter.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {moment(edited.date).format("dddd, MMMM D")}
              </Typography>
            </Box>
          </Box>
          <EntryEditor
            meter={meter}
            date={edited.date}
            entry={entry}
            autoFocus
          />
        </Box>
      )}
    </Popover>
  );
  return { openEditor, popover };
};

export default useEntryPopover;
