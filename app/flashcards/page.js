'use client'

import { useState, useEffect } from 'react'
import db from '@/firebase'

import { UserButton } from '@clerk/nextjs'
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
  Toolbar,
  Button
} from '@mui/material'
import Link from 'next/link'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {doc, collection, setDoc, getDoc, writeBatch} from '@firebase/firestore'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
          } else {
            await setDoc(docRef, { flashcards: [] })
          }
        }
        getFlashcards()
    }, [user])

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    if (!isLoaded) {
      return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
      )
    }
  
    if (!isSignedIn) {
      router.push('/sign-in')
      return
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
              <Button color="inherit" href="/generate" style={{fontFamily: "Oswald"}}>Generate</Button>
              <Button color="inherit" href="/flashcards" style={{fontFamily: "Oswald"}}>View</Button>
              <UserButton />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div" style={{fontFamily: "Oswald"}}>
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        </>
    )
  
}