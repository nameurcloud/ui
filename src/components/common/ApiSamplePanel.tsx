import React from 'react'
import { Box, Typography, useTheme, IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const icons = {
  python: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 255"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 6 }}
    >
      <path
        fill="#3776AB"
        d="M126.002 0c-36.924 0-42.508 15.797-42.508 15.797l-.053 14.834H126v14.47H74.57s-45.203.207-45.203 45.168v43.953s0 42.305 42.33 42.305h51.402s42.33.123 42.33-42.305V91.323h-51.3v27.177H97.63v-26.82h28.37s14.468-.382 14.468 14.466v41.48s.205 14.468-14.467 14.468H71.888s-14.521-.205-14.521-14.521v-14.523H35.995s-14.523.09-14.523-14.467v-42.484s-.107-14.47 14.515-14.47h39.357v-42.01s.263-14.47 14.466-14.47h40.337V0z"
      />
      <circle cx="76" cy="50" r="9" fill="#fff" />
    </svg>
  ),
  nodejs: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 272"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 6 }}
    >
      <path fill="#83CD29" d="M128 0L3 72v128l125 72 125-72V72L128 0z" />
      <path
        fill="#000"
        d="M168.98 195.4v16.33c0 8.37-7.18 15.17-15.97 15.17-7.94 0-14.87-6.14-15.74-14.09h-21.1c1.05 22.96 25.67 41.94 57.68 33.88 29.02-7.53 30.24-39.54 30.24-56.5v-63.55c0-15.43-5.15-32.02-23.05-32.02-12.02 0-18.52 8.04-22.64 15.57l-12.97-10.33c9.9-18.44 23.88-23.67 38.79-23.67 27.4 0 34.15 27.68 34.15 53.76v57.74c0 14.4-3.35 31.3-19.25 31.3-8.24 0-15.28-6.35-15.28-14.15v-16.42h-19.7z"
      />
    </svg>
  ),
  powershell: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 6 }}
    >
      <rect width="64" height="64" rx="12" fill="#012456" />
      <path d="M20 20l24 12-24 12V20z" fill="white" />
    </svg>
  ),
  terraform: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 6 }}
    >
      <path fill="#623CE4" d="M128 0L0 74.55v107.15L128 256l128-74.3V74.35L128 0z" />
      <path fill="#fff" d="M96 160h64v32H96v-32zM96 96h64v32H96V96z" />
    </svg>
  ),
}

const codeSamples = {
  python: {
    generate: `import requests

url = "https://api.nameurcloud.com/generate"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
data = {"name": "example-resource"}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
    view: `import requests

url = "https://api.nameurcloud.com/view"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
    delete: `import requests

url = "https://api.nameurcloud.com/delete/example-id"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.delete(url, headers=headers)
print(response.status_code)`,
  },
  nodejs: {
    generate: `const axios = require('axios');

axios.post('https://api.nameurcloud.com/generate', {
  name: 'example-resource'
}, {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
}).then(res => console.log(res.data));`,
    view: `const axios = require('axios');

axios.get('https://api.nameurcloud.com/view', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
}).then(res => console.log(res.data));`,
    delete: `const axios = require('axios');

axios.delete('https://api.nameurcloud.com/delete/example-id', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
}).then(res => console.log(res.status));`,
  },
  powershell: {
    generate: `
    # Set your API key
    $apiKey = "<API Key>"

    # Set request headers
    $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type"  = "application/json"
    }

    # Prepare the body (request payload)
    $body = @{
        pattern = "<Your Resource Name Pattern>"
    } | ConvertTo-Json -Depth 10

    # Send the POST request
    $response = Invoke-RestMethod \`
    -Uri "https://api.nameurcloud.com/name/<Organisation>/generate" \`
    -Method POST \`
    -Headers $headers \`
    -Body $body

    # Output the response
    Write-Output "Response: $response"`,
    view: `# Set your API key
$apiKey = "<API Key>"

# Set request headers
$headers = @{
    "Authorization" = "Bearer $apiKey"
}


$response = Invoke-RestMethod \`
-Uri "http://api.nameurcloud.com/name/<Organisation>/view" \`
-Headers $headers \`
-Method GET

Write-Output "Response :" $response
`,
    delete: `Invoke-RestMethod -Uri "https://api.nameurcloud.com/delete/example-id" -Method Delete -Headers @{
  Authorization = "Bearer YOUR_API_KEY"
}`,
  },
  terraform: {
    generate: `resource "null_resource" "api_call_generate" {
  provisioner "local-exec" {
    command = <<EOT
      curl -X POST https://api.nameurcloud.com/generate \\
        -H "Authorization: Bearer YOUR_API_KEY" \\
        -d '{"name": "example-resource"}'
    EOT
  }
}`,
    view: `resource "null_resource" "api_call_view" {
  provisioner "local-exec" {
    command = <<EOT
      curl -X GET https://api.nameurcloud.com/view \\
        -H "Authorization: Bearer YOUR_API_KEY"
    EOT
  }
}`,
    delete: `resource "null_resource" "api_call_delete" {
  provisioner "local-exec" {
    command = <<EOT
      curl -X DELETE https://api.nameurcloud.com/delete/example-id \\
        -H "Authorization: Bearer YOUR_API_KEY"
    EOT
  }
}`,
  },
}

const languages = ['python', 'nodejs', 'powershell', 'terraform'] as const
const actions = ['generate', 'view'] as const

export default function ApiSamplePanel() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const [lang, setLang] = React.useState<(typeof languages)[number]>('python')
  const [action, setAction] = React.useState<(typeof actions)[number]>('generate')

  const tabStyle = (selected: boolean) => ({
    textTransform: 'none',
    fontWeight: '600',
    borderRadius: 0, // <-- removed rounded corners
    mx: 0.5,
    px: 1.5,
    py: 1.1,
    minWidth: 90,
    display: 'flex',
    alignItems: 'center',
    bgcolor: selected ? (isLight ? '#000' : '#fff') : theme.palette.grey[300],
    color: selected
      ? isLight
        ? '#fff !important'
        : '#000 !important'
      : theme.palette.text.primary,
    fontSize: '0.75rem',
    '&:hover': {
      bgcolor: selected ? (isLight ? '#111' : '#eee') : theme.palette.grey[400],
    },
    cursor: 'pointer',
  })

  const codeBox = {
    bgcolor: isLight ? '#000' : '#fff',
    color: isLight ? '#fff' : '#000',
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '0.85rem',
    p: 2,
    borderRadius: '0 0 12px 12px',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    position: 'relative',
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSamples[lang][action])
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        API Examples
      </Typography>

      {/* Language Tabs with icon + smaller text */}
      <Box display="flex" mb={1}>
        {languages.map((l) => (
          <Box
            key={l}
            sx={tabStyle(lang === l)}
            onClick={() => setLang(l)}
            role="tab"
            aria-selected={lang === l}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setLang(l)
            }}
          >
            {icons[l]}
            {l.toUpperCase()}
          </Box>
        ))}
      </Box>

      {/* Action Tabs */}
      <Box display="flex" mb={1}>
        {actions.map((a) => (
          <Box
            key={a}
            sx={tabStyle(action === a)}
            onClick={() => setAction(a)}
            role="tab"
            aria-selected={action === a}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setAction(a)
            }}
          >
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </Box>
        ))}
      </Box>

      {/* Code Box with copy button */}
      <Box sx={codeBox}>
        <Tooltip title="Copy code" placement="top">
          <IconButton
            onClick={copyToClipboard}
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              color: isLight ? '#fff' : '#000',
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <pre style={{ margin: 0 }}>{codeSamples[lang][action]}</pre>
      </Box>
    </Box>
  )
}
