import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import ClearIcon from '@mui/icons-material/Clear'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { green, red, grey } from '@mui/material/colors'
import * as XLSX from 'xlsx'
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
  TableSortLabel,
  Paper,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
  Stack,
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { CloudConfig, getUserConfigPattern } from '../../hooks/config'
import { GeneratedName, setName, getName } from '../../hooks/names'
import { getUserProfile } from '../../hooks/user'
import { useNotification } from '../../context/NotificationContext'

export default function Names() {
  useAuthGuard()

  const { showNotification } = useNotification()
  const [data, setData] = useState<CloudConfig>()
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedResource, setSelectedResource] = useState('')
  const [selectedEnvironment, setSelectedEnvironment] = useState('')
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [userProfile, setUserProfile] = useState<any>()
  const [loadingConfig, setLoadingConfig] = useState(true)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState<keyof GeneratedName>('datetime')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    document.title = 'Names'
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile.result)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true)
        const config = await getUserConfigPattern()
        setData(config)
      } catch (error) {
        console.error('Error loading config:', error)
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const names = await getName()
        setGeneratedNames(names)
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
          current.code?.toLowerCase() || '',
          findCode(current.regions, selectedRegion),
          findCode(current.environments, selectedEnvironment),
          findCode(current.resources, selectedResource),
        ]
          .filter(Boolean)
          .join('')
      : ''

  const handleExportToExcel = () => {
    const exportData = sortedNames.map((row) => ({
      Name: row.name,
      DateTime: formatDate(row.datetime),
      User: row.user,
      Mode: row.mode,
      Status: row.status,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Generated Names')
    XLSX.writeFile(workbook, 'GeneratedNames.xlsx')
  }

  const handleGenerate = async () => {
    if (!generatedName) return
    const newEntry: GeneratedName = {
      name: generatedName,
      datetime: new Date(),
      user: userProfile?.email || 'unknown',
      mode: 'UI',
      status: 'pending',
    }

    try {
      const response = await setName(newEntry)
      if (!response.status) throw new Error('Failed to generate name.')
      const refreshedNames = await getName()
      setGeneratedNames(refreshedNames)
      showNotification(`Successfully generated name ${response.status}`, 'success')
    } catch (error) {
      console.error(error)
      setGeneratedNames((prev) =>
        prev.map((entry) =>
          entry.name === newEntry.name ? { ...entry, status: 'failure' } : entry
        )
      )
      showNotification(`Failed to generate name with the pattern ${generatedName}`, 'error')
    }
  }

  const filteredNames = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return generatedNames.filter((entry) =>
      [entry.name, entry.user, entry.mode, new Date(entry.datetime).toLocaleString()]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [searchQuery, generatedNames])

  const sortedNames = useMemo(() => {
    return [...filteredNames].sort((a, b) => {
      const valA = orderBy === 'datetime' ? new Date(a[orderBy]).getTime() : a[orderBy]
      const valB = orderBy === 'datetime' ? new Date(b[orderBy]).getTime() : b[orderBy]
      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredNames, order, orderBy])

  const handleSort = (property: keyof GeneratedName) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const formatDate = (date: Date | string) => new Date(date).toLocaleString()

  if (loadingConfig) {
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 1 } , minHeight: '100%'}} >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Form section */}
        <Box sx={{ width: { xs: '100%', md: '40%' } }}>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel>Cloud Provider</InputLabel>
            <Select
              value={selectedProvider}
              label="Cloud Provider"
              onChange={(e) => {
                setSelectedProvider(e.target.value)
                setSelectedRegion('')
                setSelectedResource('')
                setSelectedEnvironment('')
              }}
            >
              {Object.keys(data!).map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" size="small" disabled={!selectedProvider}>
            <InputLabel>Region</InputLabel>
            <Select
              label="Region"
              value={selectedRegion}
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
              label="Resource"
              value={selectedResource}
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
              label="Environment"
              value={selectedEnvironment}
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
            <Box
              component="code"
              sx={(theme) => ({
                display: 'block',
                px: 1.5,
                py: 1.25,
                borderRadius: theme.shape.borderRadius,
                fontFamily: 'Monospace',
                fontSize: theme.typography.body2.fontSize,
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor:
                  theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.common.white
                    : theme.palette.common.black,
              })}
            >
              {generatedName || 'Select values to preview name pattern'}
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={
                !selectedProvider || !selectedRegion || !selectedResource || !selectedEnvironment
              }
              onClick={handleGenerate}
            >
              Generate Name
            </Button>
          </Box>
        </Box>

        {/* Table section */}
        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 1,
            }}
          >
            <TextField
              fullWidth
              margin="dense"
              size="small"
              placeholder="Search names..."
             
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
              
            >
              Export
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 465 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['name', 'datetime', 'user', 'mode'].map((column) => (
                    <TableCell key={column} sortDirection={orderBy === column ? order : false}>
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : 'asc'}
                        onClick={() => handleSort(column as keyof GeneratedName)}
                      >
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedNames
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={`${row.name}-${row.datetime}`}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{formatDate(row.datetime)}</TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell>{row.mode}</TableCell>
                      <TableCell>
                        {row.status === 'submitted' && (
                          <CheckCircleIcon sx={{ color: green[600] }} />
                        )}
                        {row.status === 'failure' && <ErrorIcon sx={{ color: red[600] }} />}
                        {row.status === 'pending' && (
                          <HourglassBottomIcon sx={{ color: grey[600] }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedNames.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Box>
      </Stack>
    </Box>
  )
}
