import React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import axios from "axios"

const FavoriteContacts: React.FC = () => {
  const [contacts, setContacts] = useState<string[]>([])
  const [newContact, setNewContact] = useState("")

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_favorite_contacts", {
        params: { user_id: "user123" }, // Replace with actual user ID
      })
      setContacts(response.data.contacts)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  }

  const addContact = async () => {
    if (newContact && contacts.length < 5) {
      try {
        await axios.post("http://localhost:5000/set_favorite_contacts", {
          user_id: "user123", // Replace with actual user ID
          contacts: [...contacts, newContact],
        })
        setContacts([...contacts, newContact])
        setNewContact("")
      } catch (error) {
        console.error("Error adding contact:", error)
      }
    }
  }

  const removeContact = async (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index)
    try {
      await axios.post("http://localhost:5000/set_favorite_contacts", {
        user_id: "user123", // Replace with actual user ID
        contacts: updatedContacts,
      })
      setContacts(updatedContacts)
    } catch (error) {
      console.error("Error removing contact:", error)
    }
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" gutterBottom>
        Favorite Contacts (Max 5)
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField fullWidth label="New Contact" value={newContact} onChange={(e) => setNewContact(e.target.value)} />
        <Button variant="contained" onClick={addContact} disabled={contacts.length >= 5}>
          Add
        </Button>
      </Box>
      <List>
        {contacts.map((contact, index) => (
          <ListItem key={index}>
            <ListItemText primary={contact} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => removeContact(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default FavoriteContacts

