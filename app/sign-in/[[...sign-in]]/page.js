import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
    
    return (
        <>
        <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1, fontFamily: "Oswald"}}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                        Flashcard SaaS
                    </Link>
                </Typography>
                <Button color="inherit" href="/sign-up" sx={{fontFamily: "Oswald"}}>
                    Sign Up
                </Button>
            </Toolbar>
        </AppBar>

        <Container>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{textAlign: 'center', my: 4}}
        >
            <Typography variant="h4" component="h1" gutterBottom sx={{fontFamily: "Oswald"}}>
                Sign In
            </Typography>
            <SignIn />
        </Box>
        </Container>
        </>
    )
}