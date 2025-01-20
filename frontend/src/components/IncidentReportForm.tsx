import React from "react"
import { useState } from "react"
import { TextField, Button, Box, Typography } from "@mui/material"

const IncidentReportForm: React.FC = () => {
  const [incident, setIncident] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Incident reported: ${incident} (This is a placeholder action)`)
    setIncident("")
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" gutterBottom>
        Report an Incident
      </Typography>
      <TextField
        label="Incident Description"
        multiline
        rows={4}
        value={incident}
        onChange={(e) => setIncident(e.target.value)}
        sx={{ mb: 2, flexGrow: 1 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Report
      </Button>
    </Box>
  )
}

export default IncidentReportForm

