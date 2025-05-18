// src/pages/About.tsx
import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    document.title = 'About'
  }, [])

  return (
    <div>
      <h2>About Page</h2>
      <p>This is the about page of our app.</p>
    </div>
  )
}
