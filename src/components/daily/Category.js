import React from "react";
import PropTypes from "prop-types";
import withStyles from '@material-ui/core/styles/withStyles';
import IconButtonWithLabel from "../common/IconButtonWithLabel";

const styles = {
    category: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: "0.5em"
    }
}

const Category = ({
    classes,
    category,
    findBySchemaName,
    handleSubmit,
    drawTitle,
    widgets
}) => {

    if (widgets.length === 0) {
        return null;
    }

    return (
        <div
            key={category}
            className={classes.category}
        >
            {
                drawTitle &&
                <strong style={{ color: "#2d2d2d" }}>
                    {category}
                </strong>
            }
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}
            >
                <div style={{
                    display: "flex",
                    flexWrap: "wrap"
                }}>
                    {
                        widgets
                            .map(widget => (
                                <IconButtonWithLabel
                                    key={widget.name}
                                    label={widget.label}
                                    icon={widget.icon}
                                    onSubmit={() =>
                                        handleSubmit(
                                            // schemaId === schema name
                                            findBySchemaName(widget.schemaId).id,
                                            widget.label,
                                            widget.name
                                        )
                                    }
                                />
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

Category.propTypes = {
    widgets: PropTypes.array.isRequired, // TODO: use prop-types
    category: PropTypes.string.isRequired,
    schemas: PropTypes.array, // TODO: use schema prop-types once available
    findBySchemaName: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    drawTitle: PropTypes.bool
}

Category.defaultProps = {
    schemas: []
}

export default withStyles(styles)(Category);