import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material"

const SafetyMap: React.FC = () => {
  const [riskLevel, setRiskLevel] = useState("")
  const [input, setInput] = useState({
    state: "",
    crime_head: "",
    year: new Date().getFullYear().toString(),
  })
  const [states, setStates] = useState<string[]>([])
  const [crimeHeads, setCrimeHeads] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesResponse = await axios.get("http://localhost:5000/get_states")
        setStates(statesResponse.data.states)

        const crimeHeadsResponse = await axios.get("http://localhost:5000/get_crime_heads")
        setCrimeHeads(crimeHeadsResponse.data.crime_heads)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target
    setInput({ ...input, [name as string]: value })
  }

  const fetchRiskLevel = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict_risk", input)
      setRiskLevel(response.data.risk_level)
    } catch (error) {
      console.error("Error fetching risk level:", error)
    }
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" gutterBottom>
        Risk Level Predictor
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="state-label">State</InputLabel>
        <Select labelId="state-label" name="state" value={input.state} onChange={handleInputChange} label="State">
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="crime-head-label">Crime Type</InputLabel>
        <Select
          labelId="crime-head-label"
          name="crime_head"
          value={input.crime_head}
          onChange={handleInputChange}
          label="Crime Type"
        >
          {crimeHeads.map((crimeHead) => (
            <MenuItem key={crimeHead} value={crimeHead}>
              {crimeHead}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField name="year" label="Year" type="number" value={input.year} onChange={handleInputChange} fullWidth />
      <Button variant="contained" color="primary" onClick={fetchRiskLevel}>
        Predict Risk
      </Button>
      {riskLevel && (
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Predicted Risk Level: {riskLevel}
        </Typography>
      )}
    </Box>
  )
}

export default SafetyMap

