import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { green, red, grey } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { CloudConfig, getUserConfigPattern } from '../../hooks/config'
import { useNotification } from '../../context/NotificationContext'
import Grid from '@mui/material/Grid'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField
} from '@mui/material'
import { GeneratedName, setName, getName } from '../../hooks/names'
import { getUserProfile } from '../../hooks/user'

export default function Names() {
  useAuthGuard()
  

  const { showNotification } = useNotification()
  const [data, setData] = useState<CloudConfig>()
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedResource, setSelectedResource] = useState<string>('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('')
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [ userProfile , setUserProfile ] = useState<any>()

  useEffect(() => {
    document.title = 'Names'
  }, [])

  useEffect(() => {
      async function fetchProfile() {
        try {
          const profile = await getUserProfile(); // calls /profile
          setUserProfile(profile.result);
        } catch (err: any) {
          console.error(err);
        } 
      }
      fetchProfile();
    }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const jsonout: CloudConfig = await getUserConfigPattern()
        setData(jsonout)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const namesFromBackend: GeneratedName[] = await getName()
        setGeneratedNames(namesFromBackend)
      } catch (error) {
        console.error('Error fetching names:', error)
      }
    }
    fetchNames()
  }, [])

  const current = data?.[selectedProvider as keyof CloudConfig]

  const findCode = (items: { name: string; code: string }[], name: string) =>
    items.find((item) => item.name === name)?.code || ''

  const generatedName =
    selectedProvider && current
      ? [
          selectedProvider.toLowerCase(),
          findCode(current.regions, selectedRegion),
          findCode(current.environments, selectedEnvironment),
          findCode(current.resources, selectedResource),
        ]
          .filter(Boolean)
          .join('')
      : ''

 const handleGenerate = async () => {
  if (!generatedName) return

  const newEntry: GeneratedName = {
    name: generatedName,
    datetime: new Date(),
    user: userProfile.email ,
    mode: 'UI',
    status: 'pending',
  }



  try {
    const response = await setName(newEntry)
    if (!response.status) throw new Error('Failed to generate name.')

    // Fetch latest names from backend to get updated status
    const refreshedNames = await getName()
    setGeneratedNames(refreshedNames)

    showNotification(`Successfully generated name ${response.status}`, 'success')
  } catch (error) {
    console.error(error)

    // Update status to failure if setName fails
    setGeneratedNames((prev) =>
      prev.map((entry) =>
        entry.name === newEntry.name ? { ...entry, status: 'failure' } : entry
      )
    )

    showNotification(`Failed to generate name with the pattern ${generatedName}`, 'error')
  }
}

  const filteredNames = generatedNames.filter((entry) =>
    [entry.name, entry.user, entry.mode, entry.datetime.toString()]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

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

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
      <Grid container spacing={4} sx={{ height: '100%' }} >

        <Grid item xs={12} md={6} {...({} as any)}>
          <Box sx={{ minWidth: 500, width: '100%' }} >
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Cloud Provider</InputLabel>
              <Select
              margin="dense"
                size="small"
                value={selectedProvider}
                label="Cloud Provider"
                onChange={(e) => {
                  setSelectedProvider(e.target.value)
                  setSelectedRegion('')
                  setSelectedResource('')
                  setSelectedEnvironment('')
                }}
              >
                {Object.keys(data).map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small" disabled={!selectedProvider}>
              <InputLabel>Region</InputLabel>
              <Select
              margin="dense"
                size="small"
                value={selectedRegion}
                label="Region"
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {current?.regions.map((region) => (
                  <MenuItem key={region.code} value={region.name}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small" disabled={!selectedProvider}>
              <InputLabel>Resource</InputLabel>
              <Select
              margin="dense"
                size="small"
                value={selectedResource}
                label="Resource"
                onChange={(e) => setSelectedResource(e.target.value)}
              >
                {current?.resources.map((res) => (
                  <MenuItem key={res.code} value={res.name}>
                    {res.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" size="small" disabled={!selectedProvider}>
              <InputLabel>Environment</InputLabel>
              <Select
                margin="dense"
                size="small"
                value={selectedEnvironment}
                label="Environment"
                onChange={(e) => setSelectedEnvironment(e.target.value)}
              >
                {current?.environments.map((env) => (
                  <MenuItem key={env.code} value={env.name}>
                    {env.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={
                  !selectedProvider || !selectedRegion || !selectedResource || !selectedEnvironment
                }
                onClick={handleGenerate}
              >
                Generate Name
              </Button>
            </Box>
          </Box>
        </Grid>


        <Grid item xs={12} md={6} width={'60%'} {...({} as any)}>
          <Box sx={{  flex: 1 }}>
            <TextField
              fullWidth
              margin="dense"
                size="small"
              placeholder="Search names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"

              sx={{ mb: 1 }}
            />

            <TableContainer
              component={Paper}
              sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0, maxHeight: 500 , width:'100%' }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {filteredNames.length > 0 ? (
                    filteredNames.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{new Date(row.datetime).toLocaleString()}</TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>{row.mode}</TableCell>
                        <TableCell>
                          {row.status === 'submitted' && (
                            <CheckCircleIcon sx={{ color: green[600] }} titleAccess="Submitted" />
                          )}
                          {row.status === 'failure' && (
                            <ErrorIcon sx={{ color: red[600] }} titleAccess="Failure" />
                          )}
                          {row.status === 'pending' && (
                            <HourglassBottomIcon sx={{ color: grey[600] }} titleAccess="Pending" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align='center'>No names generated.   Give your first try !!</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
