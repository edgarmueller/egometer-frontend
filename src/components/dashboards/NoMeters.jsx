import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TuneRounded from "@mui/icons-material/TuneRounded";
import EmptyState from "../common/EmptyState";

const NoMeters = () => (
  <Card>
    <EmptyState
      icon={<TuneRounded sx={{ fontSize: 48 }} />}
      title="Nothing to track yet"
      action={
        <Button variant="contained" component={Link} to="/meters">
          Add a meter
        </Button>
      }
    >
      Add meters for what you want to track, like your mood or your activities,
      and fill them in every day.
    </EmptyState>
  </Card>
);

export default NoMeters;
