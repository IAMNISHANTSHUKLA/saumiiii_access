import React from "react"
import { useState, useEffect } from "react"
import { Button, Box, Typography, Snackbar } from "@mui/material"
import AlarmIcon from "@mui/icons-material/Alarm"
import axios from "axios"
import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

const AlertButton: React.FC = () => {
  const [favoriteContacts, setFavoriteContacts] = useState<string[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  useEffect(() => {
    // Fetch favorite contacts when component mounts
    const fetchFavoriteContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_favorite_contacts", {
          params: { user_id: "user123" }, // Replace with actual user ID
        })
        setFavoriteContacts(response.data.contacts)
      } catch (error) {
        console.error("Error fetching favorite contacts:", error)
      }
    }

    fetchFavoriteContacts()

    // Set up socket listener for SOS alerts
    socket.on("sos_sent", (data) => {
      setSnackbarMessage(data.message)
      setSnackbarOpen(true)
    })

    // Clean up socket listener on component unmount
    return () => {
      socket.off("sos_sent")
    }
  }, [])

  const handleAlert = () => {
    if (favoriteContacts.length === 0) {
      setSnackbarMessage("Please add favorite contacts before sending an SOS")
      setSnackbarOpen(true)
      return
    }

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        // Emit SOS alert through socket
        socket.emit("sos_alert", {
          user_id: "user123", // Replace with actual user ID
          location: location,
        })
      },
      (error) => {
        console.error("Error getting location:", error)
        setSnackbarMessage("Unable to get your location. SOS not sent.")
        setSnackbarOpen(true)
      },
    )
  }

  return (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      <Typography variant="h6" gutterBottom>
        Emergency Alert
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        startIcon={<AlarmIcon />}
        onClick={handleAlert}
        sx={{ mt: 2 }}
      >
        Trigger SOS Alert
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  )
}

export default AlertButton

