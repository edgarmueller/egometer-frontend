import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Box from "@mui/material/Box";

// links open in a new tab, so the journal stays open
const components = {
  // eslint-disable-next-line react/prop-types
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

/**
 * Renders Markdown with GitHub's extensions (lists of tasks, tables,
 * strikethrough, links) in the app's typography. Raw HTML is ignored.
 */
const Markdown = ({ children }) => (
  <Box
    sx={(theme) => ({
      ...theme.typography.body1,
      overflowWrap: "anywhere",
      "& > :first-of-type": { mt: 0 },
      "& > :last-child": { mb: 0 },
      "& p, & ul, & ol, & blockquote, & pre, & table": { my: 1 },
      "& h1, & h2, & h3, & h4, & h5, & h6": {
        ...theme.typography.subtitle1,
        mt: 2,
        mb: 0.5,
      },
      "& h1": { fontSize: "1.25rem" },
      "& h2": { fontSize: "1.125rem" },
      "& ul, & ol": { pl: 3 },
      "& li > p": { my: 0 },
      // task lists render checkboxes instead of bullets
      "& li.task-list-item": { listStyle: "none", ml: -3 },
      "& input[type=checkbox]": { mr: 1, verticalAlign: "middle" },
      "& a": { color: "primary.main" },
      "& blockquote": {
        mx: 0,
        pl: 2,
        color: "text.secondary",
        borderLeft: 3,
        borderColor: "divider",
      },
      "& code": {
        fontFamily: "monospace",
        fontSize: "0.875em",
        px: 0.5,
        borderRadius: 1,
        bgcolor: "action.hover",
      },
      "& pre": {
        p: 1.5,
        overflowX: "auto",
        borderRadius: 1,
        bgcolor: "action.hover",
        "& code": { p: 0, bgcolor: "transparent" },
      },
      "& table": { borderCollapse: "collapse" },
      "& th, & td": {
        px: 1,
        py: 0.5,
        border: 1,
        borderColor: "divider",
        textAlign: "left",
      },
      "& hr": { border: 0, borderTop: 1, borderColor: "divider", my: 2 },
    })}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  </Box>
);

Markdown.propTypes = {
  children: PropTypes.string,
};

export default Markdown;
