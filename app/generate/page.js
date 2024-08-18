'use client'

import { useState } from 'react'
import db from '@/firebase'

import { UserButton } from '@clerk/nextjs'
import {
  CircularProgress,
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar
} from '@mui/material'

import {useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {doc, collection, setDoc, getDoc, writeBatch} from '@firebase/firestore'
import Link from 'next/link'

export default function Generate() {
  const {isLoaded, isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

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

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
  
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)
  
      if (userDocSnap.exists()) {
        const collections = userDocSnap.data().flashcards || []
        if (collections.find((f) => f.name === name)){
          alert("Flashcard collection with the same name already exists")
          return
        }
        collections.push({name})
        batch.update(userDocRef, { flashcards: collections }, { merge: true })
      } else {
        batch.set(userDocRef, { flashcards: [{ name }] })
      }
  
      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleClose()
      router.push('/flashcards')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
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
              <Button color="inherit" href="/flashcards" style={{fontFamily: "Oswald"}}>View</Button>
              <UserButton />
          </Toolbar>
        </AppBar>
      <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      
      {flashcards.length > 0 && (
  <Box sx={{ mt: 4, paddingY: 4 }}>
    <Typography variant="h5" component="h2" gutterBottom>
      Generated Flashcards
    </Typography>
    <Grid container spacing={2}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea
              onClick={() => {
                handleCardClick(index)
              }}
            >
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
                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                    <Typography variant="h6" component="div" sx={{
                      fontFamily: "Oswald",
                      fontSize: 'clamp(12px, 2vw, 20px)',
                      overflow: 'hidden',
                    }}>
                      {flashcard.front}</Typography>
                    </div>
                    <div>
                    <Typography variant="h6" component="div" sx={{
                      fontFamily: "Oswald",
                      fontSize: 'clamp(12px, 2vw, 20px)',
                      overflow: 'hidden',
                    }}>
                      {flashcard.back}</Typography>
                    </div>
                  </div>
                </Box>
            </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" color="primary" onClick={handleOpen}>
      Save Flashcards
    </Button>
  </Box>
  </Box>
)}

    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>Save Flashcards</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcard collection
        </DialogContentText>
        <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={saveFlashcards}>Save</Button>
      </DialogActions>
    </Dialog>
    </Container>
    </>
  
  )
}