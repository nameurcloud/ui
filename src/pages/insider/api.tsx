import { useAuthGuard } from '../../hooks/useAuthGuard'
import { setApiKey, getApiKeys, deleteApiKeyByPartialKeyAndEmail } from '../../hooks/api'
import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  TablePagination,
  InputAdornment,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { getPlan } from '../../hooks/plan'
import { v4 as uuidv4 } from 'uuid'
import { useNotification } from '../../context/NotificationContext'

const EXPIRY_OPTIONS = [
  { label: '1 Month', value: 1 },
  { label: '2 Months', value: 2 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 6 },
  { label: '12 Months', value: 12 },
  { label: 'Never', value: 0 },
]

const PERMISSIONS = ['generate', 'view', 'delete']

export default function Api() {
  useAuthGuard()
  const theme = useTheme()
  const { showNotification } = useNotification()
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [expiry, setExpiry] = useState(1)
  const [permissions, setPermissions] = useState<string[]>([])
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'key' | 'email' | 'expiry' | 'permissions'>('email')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean
    partialKey: string | null
    email: string | null
  }>({
    open: false,
    partialKey: null,
    email: null,
  })

  const deleteApiKey = async (partialKey: string, email: string) => {
    try {
      const status = await deleteApiKeyByPartialKeyAndEmail(partialKey, email)
      if (status === 'Deleted') {
        setApiKeys((prev) =>
          prev.filter((k) => !(k.partialKey === partialKey && k.email === email))
        )
        showNotification('API key deleted successfully', 'success')
      } else {
        throw new Error('Delete API key failed')
      }
    } catch (error) {
      console.error(error)
      showNotification('Failed to delete API key', 'error')
    }
  }

  useEffect(() => {
    document.title = 'API'
  }, [])

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const result = await getPlan()
        setPlan(result)
      } catch (err) {
        console.error('Failed to fetch plan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true)
      try {
        const keysFromDb = await getApiKeys()
        const keysWithDate = keysFromDb.map((key) => ({
          ...key,
          expiry: new Date(key.expiry),
        }))
        setApiKeys(keysWithDate)
      } catch (error) {
        console.error('Failed to fetch API keys:', error)
        showNotification('Failed to load API keys', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchApiKeys()
  }, [])

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      // toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc') // default to ascending when new column selected
    }
  }

  const handlePermissionChange = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleGenerateKey = async () => {
    const newKey = uuidv4().replace(/-/g, '')
    const partialKey = `${newKey.slice(0, 4)}...${newKey.slice(-4)}`
    const newEntry = {
      id: uuidv4(),
      partialKey,
      key: newKey,
      email,
      expiry:
        expiry === 0
          ? new Date('2025-06-17T07:32:38.273Z')
          : new Date(Date.now() + expiry * 30 * 24 * 60 * 60 * 1000),
      permissions: permissions,
    }

    setGeneratedKey(newKey)
    setApiKeys((prev) => [...prev, newEntry])

    try {
      const response = await setApiKey(newEntry)
      if (response !== 'Created New Key') throw new Error('Failed to save API key')
      showNotification(`API Key generated: ${partialKey}`, 'success')
    } catch (error) {
      console.error(error)
      showNotification(`Error generating API key: ${partialKey}`, 'error')
    }
  }

  const sortedFilteredKeys = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    let filtered = apiKeys.filter((k) =>
      Object.values(k).join(' ').toLowerCase().includes(lowerSearch)
    )

    const compareFns: Record<typeof sortBy, (a: any, b: any) => number> = {
      key: (a, b) => a.partialKey.localeCompare(b.partialKey),
      email: (a, b) => a.email.localeCompare(b.email),
      expiry: (a, b) => a.expiry.getTime() - b.expiry.getTime(),
      permissions: (a, b) => a.permissions.join(', ').localeCompare(b.permissions.join(', ')),
    }

    filtered.sort((a, b) => {
      const res = compareFns[sortBy](a, b)
      return sortDirection === 'asc' ? res : -res
    })

    return filtered
  }, [apiKeys, search, sortBy, sortDirection])

  const isLimitedPlan = plan === 'Essentials' || plan === 'Premium'

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isLimitedPlan) {
    return (
      <Box
        sx={{
          p: 4,
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, borderRadius: 3, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Plan Name: <strong>{plan}</strong>
          </Typography>
          <Typography variant="body2">
            Your current plan does not support this feature. Upgrade to a premium plan to unlock
            full configuration access.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        onClick={() => {
          setDialogOpen(true)
          setEmail('')
          setExpiry(1)
          setPermissions([])
          setGeneratedKey(null)
        }}
        sx={{ mb: 2 }}
      >
        Create API Key
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort('key')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Key {sortBy === 'key' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell
                onClick={() => handleSort('email')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Email {sortBy === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell
                onClick={() => handleSort('expiry')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Expiry {sortBy === 'expiry' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell
                onClick={() => handleSort('permissions')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Permissions {sortBy === 'permissions' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedFilteredKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Create API key to integrate with your fevorate tools.
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredKeys
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.partialKey}</TableCell>
                    <TableCell>{key.email}</TableCell>
                    <TableCell>{key.expiry.toLocaleString()}</TableCell>
                    <TableCell>{key.permissions.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          setConfirmDelete({
                            open: true,
                            partialKey: key.partialKey,
                            email: key.email,
                          })
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedFilteredKeys.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </TableContainer>

      {/* Dialog for Creating API Key */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEmail('')
          setExpiry(1)
          setPermissions([])
          setGeneratedKey(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate API Key</DialogTitle>
        <DialogContent>
          {generatedKey ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Your new API key:
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  wordBreak: 'break-word',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                {generatedKey}
              </Paper>
              <Button
                variant="outlined"
                onClick={() => navigator.clipboard.writeText(generatedKey)}
              >
                Copy to Clipboard
              </Button>
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Note: You won’t be able to view this key again. Please copy and store it securely.
              </Typography>
            </Box>
          ) : (
            <>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                helperText={
                  email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? 'Please enter a valid email address'
                    : ''
                }
              />
              <TextField
                select
                label="Expiry"
                fullWidth
                margin="normal"
                value={expiry}
                onChange={(e) => setExpiry(Number(e.target.value))}
              >
                {EXPIRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Permissions
              </Typography>
              <FormGroup row>
                {PERMISSIONS.map((perm) => (
                  <FormControlLabel
                    key={perm}
                    control={
                      <Checkbox
                        checked={permissions.includes(perm)}
                        onChange={() => handlePermissionChange(perm)}
                      />
                    }
                    label={perm}
                  />
                ))}
              </FormGroup>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false)
              setEmail('')
              setExpiry(1)
              setPermissions([])
              setGeneratedKey(null)
            }}
          >
            {generatedKey ? 'Close' : 'Cancel'}
          </Button>
          {!generatedKey && (
            <Button
              variant="contained"
              onClick={handleGenerateKey}
              disabled={!email || permissions.length === 0}
            >
              Generate
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, partialKey: null, email: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this API key?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, partialKey: null, email: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (confirmDelete.partialKey && confirmDelete.email)
                await deleteApiKey(confirmDelete.partialKey, confirmDelete.email)
              setConfirmDelete({ open: false, partialKey: null, email: null })
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
