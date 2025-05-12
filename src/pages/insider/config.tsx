import { useEffect, useState } from 'react'
import { useNotification } from '../../context/NotificationContext';
import LockIcon from '@mui/icons-material/Lock'
import {
  getUserConfigPattern,
  CloudConfig,
  setUserConfigPattern
} from '../../hooks/config'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Box,
  Button,
  Skeleton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { getPlan } from '../../hooks/plan'

type CloudCategory = {
  name: string
  code: string
}

type CloudProviderData = {
  regions: CloudCategory[]
  resources: CloudCategory[]
  environments: CloudCategory[]
}

type EditedItem = {
  cloud: string
  name: string
  before: string
  after: string
  category: string
}

export default function Config() {
  useAuthGuard()
  const { showNotification } = useNotification();

  useEffect(() => {
    document.title = 'Configuration'
  }, [])

  const theme = useTheme()
  const [selectedProvider, setSelectedProvider] = useState<keyof CloudConfig>('AWS')
  const [search, setSearch] = useState<Record<string, string>>({})
  const [data, setData] = useState<CloudConfig>()
  const [edited, setEdited] = useState<Record<string, EditedItem | undefined>>({})

  const [localUserPlan, setLocalUserPlan] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      const plan = await getPlan()
      setLocalUserPlan(plan)
    }
    fetchPlan()
  }, [])




  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const jsonout:CloudConfig = await getUserConfigPattern()
        setData(jsonout)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
    fetchConfig()
  }, [])

  const handleSaveChanges = async () => {
    if (!data) return
    try {
      const payload = { config: data }
      const response = await setUserConfigPattern(payload)
      if (!response.ok) throw new Error('Failed to save configuration')
      showNotification('Configuration saved successfully!', 'success')
      setEdited({})
    } catch (error) {
      console.error(error)
      showNotification('Error saving configuration.', 'error')
    }
  }

  const handleCodeChange = (
    category: keyof CloudProviderData,
    index: number,
    newCode: string
  ) => {
    if (!data) return

    const originalCode = data[selectedProvider][category][index].code
    const updated = structuredClone(data)
    updated[selectedProvider][category][index].code = newCode.toUpperCase()
    setData(updated)

    const key = `${selectedProvider}-${category}-${index}`
    const changed = newCode.toUpperCase() !== originalCode
    setEdited((prev) => ({
      ...prev,
      [key]: changed
        ? {
            cloud: selectedProvider,
            name: updated[selectedProvider][category][index].name,
            before: originalCode,
            after: newCode.toUpperCase(),
            category
          }
        : undefined
    }))
  }

  const renderAccordion = (category: keyof CloudProviderData) => {
    if (!data) return null
    const items = data[selectedProvider][category].filter((item:any) =>
      (search[category] || '') === ''
        ? true
        : item.name.toLowerCase().includes(search[category].toLowerCase())
    )

    return (
      <Accordion key={category} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {capitalize(category)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            size="small"
            fullWidth
            placeholder={`Search ${category}`}
            value={search[category] || ''}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, [category]: e.target.value }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{ mb: 1 }}
          />
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                {items.map((item:any, index:any) => {
                  const editKey = `${selectedProvider}-${category}-${index}`
                  const isChanged = Boolean(edited[editKey])
                  return (
                    <TableRow key={item.name}>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{item.name}</TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={item.code}
                          onChange={(e) =>
                            handleCodeChange(category, index, e.target.value)
                          }
                          inputProps={{
                            maxLength: 2,
                            style: { textAlign: 'center' }
                          }}
                          sx={{
                            width: 60,
                            backgroundColor: isChanged
                              ? theme.palette.mode === 'dark'
                                ? '#554'
                                : '#fff3cd'
                              : 'inherit'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    )
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={60} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={150} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={100} sx={{ my: 1 }} />
      </Box>
    )
  }

  const categories = Object.keys(data?.[selectedProvider] || {}) as (keyof CloudProviderData)[]
  const changedItems = Object.entries(edited)
    .filter(([, val]) => val)
    .map(([, val]) => val as EditedItem)

  if (localUserPlan === 'Essentials' || localUserPlan === 'Essentials+') {
    return (
      <Box
        sx={{
          p: 4,
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#fafafa',
            borderRadius: 3
          }}
        >
          <LockIcon
            sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Plan Name: <strong>{localUserPlan}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your current plan does not support this feature.
            <br />
            Upgrade to a premium plan to unlock full configuration access.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>


      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={Object.keys(edited).length === 0}
          onClick={handleSaveChanges}
        >
          Save All Changes
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ mb: 3, mt: 2, p: 1 }}>
        <ToggleButtonGroup
          fullWidth
          value={selectedProvider}
          exclusive
          onChange={(_, newVal) => {
            if (newVal) {
              setSelectedProvider(newVal)
              setSearch({})
            }
          }}
          color="primary"
        >
          {Object.keys(data).map((provider) => (
            <ToggleButton
              key={provider}
              value={provider}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {provider}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      <Box sx={{ width: '100%', mb: 4 }}>
        {categories.map((category) => renderAccordion(category))}
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle1" gutterBottom>
          Changed Records
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'
              }}
            >
              <TableRow>
                <TableCell sx={{ fontSize: '0.75rem' }}>Cloud</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Category</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Name</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>Before</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>After</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {changedItems.length > 0 ? (
                changedItems.map((item, idx) => (
                  <TableRow key={`${item.name}-${idx}`}>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.cloud}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.category}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.before}</TableCell>
                    <TableCell
                      sx={{
                        fontSize: '0.8rem',
                        color:
                          item.before !== item.after
                            ? theme.palette.warning.main
                            : 'inherit',
                        fontWeight: 500
                      }}
                    >
                      {item.after}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontSize: '0.8rem' }}>
                    No changes yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
