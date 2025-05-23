import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import subscriptionOptions from '../components/common/subscriptionOptions'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import LabelWithTooltip from '../components/common/LabelWithTooltip'

const HEADER_HEIGHT = 65


const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobile, setMobile] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('0')
  const [organization, setOrganization] = useState('')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success',
  })

  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }))
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedPlan(e.target.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await registerUser(
        email,
        password,
        firstName,
        lastName,
        mobile,
        dob,
        subscriptionOptions[Number(selectedPlan)].plan,
        organization
      )
      if (res.ok) {
        setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' })
        setTimeout(() => navigate('/login'), 1000)
      } else if (res.status === 400) {
        setSnackbar({ open: true, message: 'User already exists', severity: 'error' })
      } else if (res.status === 401) {
        setSnackbar({ open: true, message: 'Organization already taken', severity: 'error' })
      } else {
        setSnackbar({ open: true, message: 'Registration failed', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' })
    }
  }
  useEffect(() => {
    document.title = 'Register'
  }, [])
  return (
    <Box
      sx={{
        minHeight: isMobile ? '100%' : `calc(90vh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: isMobile ? 'flex-start' : 'center',
        p: 2,
        gap: 2,
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Subscription Section */}
      <Box
        sx={{
          flex: isMobile ? 'unset' : 6,
          minWidth: isMobile ? '100%' : '60%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 1000,
              letterSpacing: 2,
              mb: 3,
              fontSize: { xs: '1rem', sm: '1rem', md: '2rem' },
              fontFamily: 'Poppins, sans-serif',
              background: `linear-gradient(4deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(193, 12, 12, 0.2)',
            }}
          >
            Pricing Model
          </Typography>

          <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <RadioGroup value={selectedPlan} onChange={handleRadioChange} sx={{ width: '100%' }}>
              {subscriptionOptions.map((option, idx) => {
                const isSelected = selectedPlan === String(idx)
                return (
                  <Paper
                    key={idx}
                    elevation={isSelected ? 4 : 1}
                    sx={{
                      p: 2,
                      width: isMobile ? '90%' : '90%',
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: isSelected
                        ? theme.palette.mode === 'dark'
                          ? theme.palette.action.selected
                          : theme.palette.primary.light
                        : 'background.paper',
                      border: isSelected
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                      transition: '0.3s',
                    }}
                  >
                    <FormControlLabel
                      value={String(idx)}
                      control={<Radio />}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              &nbsp; {option.plan}
                            </Typography>
                            {option.plan === 'Essentials+' && (
                              <Typography
                                variant="caption"
                                sx={{
                                  ml: 1,
                                  px: 1,
                                  py: 0.5,
                                  bgcolor: 'secondary.main',
                                  color: 'secondary.contrastText',
                                  borderRadius: 1,
                                  fontWeight: 700,
                                }}
                              >
                                ⭐ Most Popular
                              </Typography>
                            )}
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontFamily="monospace"
                            sx={{ color: 'dark green' }}
                          >
                            &nbsp; ₹{option.cost}/Year
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="body2" sx={{ mt: 1, ml: 4, color: 'text.secondary' }}>
                      {option.content}
                    </Typography>
                  </Paper>
                )
              })}
            </RadioGroup>
          </Stack>

          <Typography
            variant="body2"
            align="center"
            sx={{ fontStyle: 'italic', mt: 2, color: 'text.secondary' }}
          >
            A small fee helps us keep our systems running smoothly and rewards our dedicated team.
          </Typography>
        </Box>
      </Box>

      {/* Registration Form */}
      <Box
        sx={{
          flex: isMobile ? 'unset' : 4,
          width: isMobile ? '100%' : '40%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 600,
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={1.5}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Mobile Number"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              fullWidth
              label={
                <LabelWithTooltip
                  label="Organization"
                  message="Enter the legal name of your organization."
                />
              }
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
