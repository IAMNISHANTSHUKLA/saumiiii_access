import React from "react"
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material"

const PredictiveInsights: React.FC = () => {
  const insights = [
    "Downtown area shows increased risk during late hours",
    "Park near 5th Avenue requires additional lighting",
    "Public transportation safety improved by 15% this month",
  ]

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Predictive Insights
      </Typography>
      <List>
        {insights.map((insight, index) => (
          <ListItem key={index}>
            <ListItemText primary={insight} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default PredictiveInsights

