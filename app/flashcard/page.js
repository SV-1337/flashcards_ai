
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
import {useSearchParams} from 'next/navigation'
import {doc, collection, getDocs} from '@firebase/firestore'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
  
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return
      
          const colRef = collection(doc(collection(db, 'users'), user.id), search)
          const docs = await getDocs(colRef)
          const flashcards = []
          docs.forEach((doc) => {
            flashcards.push({ id: doc.id, ...doc.data() })
          })
          setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
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
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box sx={{
                  perspective: '1000px',
                  '& > div' : {
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  },
                  '& > div > div' : {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    boxSixing: 'border-box',
                  },
                  '& > div > div:nth-of-type(2)' : {
                    transform: 'rotateY(180deg)',
                  }
                }}>
                        <div>
                          <div>
                            <Typography variant="h5" component="div" style=
                            {{
                              fontFamily: "Oswald",
                              fontSize: 'clamp(12px, 2vw, 20px)',
                              overflow: 'hidden',
                            }}>
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div" style=
                            {{
                              fontFamily: "Oswald",
                              fontSize: 'clamp(12px, 2vw, 20px)',
                              overflow: 'hidden',
                            }}>
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
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