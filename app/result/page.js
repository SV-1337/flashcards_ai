'use client'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSearchParams} from 'next/navigation' 
import { UserButton, SignedIn } from '@clerk/nextjs'
import Link from 'next/link'

import {
  CircularProgress,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button
} from '@mui/material'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
          <>
          <AppBar sx={{ width: 'vw', position: 'static'}}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1, fontFamily: "Oswald"}}>
                <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                  Flashcard SaaS
                </Link>
            </Typography>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
          </>
        )
    }

    if (error) {
        return (
          <>
          <AppBar sx={{ width: 'vw', position: 'static'}}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1, fontFamily: "Oswald"}}>
                <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                  Flashcard SaaS
                </Link>
            </Typography>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </Toolbar>
        </AppBar>
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
          </>
        )
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
        <SignedIn>
              <UserButton />
            </SignedIn>
        </Toolbar>
    </AppBar>
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          {session.payment_status === 'paid' ? (
            <>
              <Typography variant="h4" style={{fontFamily: "Oswald"}}>Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1" style={{fontFamily: "Oswald"}}>
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
                <Button variant="contained" href="/" sx={{marginY: 2, fontFamily: "Oswald"}}>Return to home page</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" style={{fontFamily: "Oswald"}}>Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again.
                </Typography>
              </Box>
            </>
          )}
        </Container>
        </>
    )
}

export default ResultPage