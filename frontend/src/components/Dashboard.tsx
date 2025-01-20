import React from "react"
import { Container, Grid, Paper } from "@mui/material"
import SafetyMap from "./SafetyMap"
import AlertButton from "./AlertButton"
import IncidentReportForm from "./IncidentReportForm"
import PredictiveInsights from "./PredictiveInsights"
import FavoriteContacts from "./FavoriteContacts"

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 400 }}>
            <SafetyMap />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
            <AlertButton />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
            <IncidentReportForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}>
            <PredictiveInsights />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}>
            <FavoriteContacts />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard

