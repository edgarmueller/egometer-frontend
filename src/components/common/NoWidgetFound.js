import React from 'react';
import Ionicon from "react-ionicons";

const NoWidgetFound = ({ requestedWidget, widgetType }) => {
    if (process.env.NODE_ENV === "development") {
        return (
            <div
                style={{
                    backgroundColor: "#f73378",
                    color: "#fff",
                    borderRadius: 10,
                    width: "300px",
                    margin: "0 auto 10px",
                    padding: 10
                }}
            >
                <Ionicon
                    icon="md-close-circle"
                    style={{ padding: 10 }}
                    color="#fff"
                    fontSize={"50"}
                />
                <div style={{ fontWeight: "bold", fontSize: 20 }}>No widget found</div>
                <div>Requested widget: {requestedWidget}</div>
                <div>Widget type: {widgetType}</div>
            </div>
        );
    } else {
        return null;
    }
};

export default NoWidgetFound;