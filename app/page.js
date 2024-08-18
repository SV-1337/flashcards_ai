'use client'

import Image from "next/image";
import getStripe from '../utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Container, Toolbar, Typography, Button, Grid, Box} from "@mui/material";
import Link from 'next/link'
import FeatureIcon1 from '@mui/icons-material/FlashOn';
import FeatureIcon2 from '@mui/icons-material/Storage';
import FeatureIcon3 from '@mui/icons-material/Security';

export default function Home() {
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <>
        <AppBar sx={{ width: 'vw', position: 'static'}}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1, fontFamily: "Oswald"}}>
                <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                  Flashcard SaaS
                </Link>
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in" style={{fontFamily: "Oswald"}}>Sign In</Button>
              <Button color="inherit" href="/sign-up" style={{fontFamily: "Oswald"}}>Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <Button color="inherit" href="/generate" style={{fontFamily: "Oswald"}}>Generate</Button>
              <Button color="inherit" href="/flashcards" style={{fontFamily: "Oswald"}}>View</Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
    <Container>
      <Box sx={{textAlign: 'center', my: 4}}>
          <Typography variant="h2" component="h1" gutterBottom style={{fontFamily: "Oswald"}}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom style={{fontFamily: "Oswald"}}>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="outlined" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
            Get Started
          </Button>
      </Box>

      <Box sx={{my: 6, textAlign: "center"}}>
        <Typography variant="h4" component="h2" gutterBottom style={{fontFamily: "Oswald"}}>Features</Typography>
        <Grid container spacing={4}>

                      <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--text-color)',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 3,
                }}
              >
                <FeatureIcon1 sx={{ fontSize: 60, color: 'var(--highlight-color)' }} />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  Lightning Fast
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontFamily: "Oswald" }}>
                  Experience incredibly fast load times and smooth performance.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--text-color)',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 3,
                }}
              >
                <FeatureIcon2 sx={{ fontSize: 60, color: 'var(--highlight-color)' }} />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  Secure Storage
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontFamily: "Oswald" }}>
                  Your data is safe with industry-leading encryption and security practices.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--text-color)',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 3,
                }}
              >
                <FeatureIcon3 sx={{ fontSize: 60, color: 'var(--highlight-color)' }} />
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  Reliable Support
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontFamily: "Oswald" }}>
                  Help is available 24/7 for all kinds of issues, from website to UI to payment.
                </Typography>
              </Box>
            </Grid>
          </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom sx={{fontFamily: "Oswald" }}>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">

           <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--text-color)',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 3,
                }}
              >
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  Free
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  $0.00 / month
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontFamily: "Oswald" }}>
                  Limited features and usage
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Choose free
                </Button>
              </Box>
            </Grid>

            {/* Price 3 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--text-color)',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: 3,
                }}
              >
                <Typography variant="h5" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  Pro
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, fontFamily: "Oswald" }}>
                  $10.00 / month
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontFamily: "Oswald" }}>
                  Unlimited everything!
                </Typography>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
        </Grid>
      </Box>
      </Container>
    </>
  )
}
