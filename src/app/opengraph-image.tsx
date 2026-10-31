import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'HUM Properties - Luxury Properties in Dubai'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  let base64Image = ''
  try {
    const imagePath = join(process.cwd(), 'public', 'hero_poster.jpg')
    const imageData = await readFile(imagePath)
    base64Image = `data:image/jpeg;base64,${imageData.toString('base64')}`
  } catch (error) {
    console.error('Failed to load hero_poster.jpg for OG image:', error)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          position: 'relative',
        }}
      >
        {base64Image && (
          <img
            src={base64Image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            alt="Background"
          />
        )}
        
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #d4af37', // Brand Gold
            padding: '60px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            HUM Properties
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#d4af37', // Brand Gold
              fontFamily: 'sans-serif',
              textAlign: 'center',
              marginTop: '0',
            }}
          >
            Exclusive Luxury Properties in Dubai
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '40px',
              backgroundColor: '#fff',
              color: '#000',
              padding: '15px 40px',
              borderRadius: '50px',
              fontSize: '28px',
              fontWeight: 'bold',
            }}
          >
            Explore Portfolio &rarr;
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
