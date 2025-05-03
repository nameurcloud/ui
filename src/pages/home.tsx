import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material'

const HEADER_HEIGHT = 65

const Home: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        minHeight: isMobile ? '100%' : `calc(100vh - ${HEADER_HEIGHT}px)`,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          gap: 2,
          padding: 2,
        }}
      >
        {/* Left Panel Placeholder */}
        <Paper
          sx={{
            flex: 0,
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 3,
            p: 2,

            background: 'linear-gradient(135deg, #673ab7, #3f51b5, #2196f3, #00bcd4)',
            backgroundSize: '400% 400%',
          }}
        ></Paper>

        <Paper
          sx={{
            flex: 1,
            borderRadius: 4,
            display: 'flex',
            boxShadow: 3,
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box
            sx={{
              maxWidth: 700,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: 600,
                mt: 2,
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.2rem', md: '2.5rem' },
              }}
              color="text.secondary"
            >
              Smart, Effortless Naming for Your Infrastructure
            </Typography>

            <Typography sx={{ mb: 1, fontSize: '.9rem' }} color="text.secondary">
              We generate <span style={{ color: '#1565c0', fontWeight: 600 }}>unique names</span>{' '}
              for your infrastructure components, helping you{' '}
              <span style={{ fontWeight: 500 }}>organize</span> and{' '}
              <span style={{ fontWeight: 500 }}>manage</span> your cloud resources more efficiently.
            </Typography>

            <Typography sx={{ mb: 1, fontSize: '.9rem' }} color="text.secondary">
              Seamlessly integrate with your existing stack using:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                component="ul"
                sx={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#0277bd',
                  fontSize: '.9rem',
                  textAlign: 'left',
                }}
              >
                <li>📦 Client Libraries</li>
                <li>🔌 RESTful APIs</li>
                <li>💻 Command-line Tools</li>
              </Box>

              <Box
                component="img"
                src="/images/home3.png"
                alt="Robot naming cloud resources"
                sx={{
                  maxWidth: { xs: '100%', sm: 150 },
                  height: 'auto',
                  borderRadius: 2,
                }}
              />
            </Box>

            <Typography sx={{ mb: 1, fontSize: '.9rem' }} color="text.secondary">
              <span style={{ color: '#d32f2f', fontWeight: 600 }}>
                Leave naming conventions to us
              </span>{' '}
              — or take full control and customize them your way.
            </Typography>

            <Typography sx={{ fontSize: '.9rem' }} color="text.secondary">
              <strong style={{ color: '#388e3c' }}>Yes, you heard it right!</strong> We offer
              flexible options so you can define a naming strategy that matches your team's style
              and standards.
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #673ab7, #9c27b0)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5e35b1, #8e24aa)',
                  boxShadow: '0 6px 18px rgba(156, 39, 176, 0.6)',
                },
              }}
              component={Link}
              to="register"
            >
              ✍️ Sign Up Now
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Home
