import React from "react"
import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import SecurityIcon from "@mui/icons-material/Security"

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <SecurityIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Women's Safety Platform
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header

