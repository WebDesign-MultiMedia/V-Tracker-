import React, { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTrash, faCircle, faStop, faCamera } from '@fortawesome/free-solid-svg-icons'
import Navbar from './Navbar'
import Footer from './Footer'

const makePartSVG = (title, sub, price, date, accent = '#dc2626') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
    <rect width="400" height="280" fill="#111827"/>
    <rect width="400" height="3" fill="${accent}"/>
    <rect x="155" y="55" width="90" height="80" rx="14" fill="#1f2937" stroke="#374151" stroke-width="2"/>
    <rect x="168" y="68" width="64" height="54" rx="9" fill="#374151"/>
    <circle cx="200" cy="95" r="19" fill="${accent}" opacity="0.85"/>
    <rect x="188" y="88" width="24" height="3" rx="1.5" fill="white"/>
    <rect x="188" y="95" width="24" height="3" rx="1.5" fill="white"/>
    <rect x="188" y="102" width="16" height="3" rx="1.5" fill="white"/>
    <text x="200" y="162" text-anchor="middle" fill="white" font-size="18" font-family="Arial,sans-serif" font-weight="bold">${title}</text>
    <text x="200" y="185" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="Arial,sans-serif">${sub}</text>
    <text x="200" y="213" text-anchor="middle" fill="#4ade80" font-size="16" font-family="Arial,sans-serif" font-weight="bold">${price}</text>
    <text x="200" y="237" text-anchor="middle" fill="#6b7280" font-size="11" font-family="Arial,sans-serif">${date}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const DUMMY_IMAGES = [
  { src: makePartSVG('Brake Pads', 'Front Driver Side · Midas Auto', '$89.99', 'Jan 10, 2025'), label: 'Brake Pads', part: 'Front Driver Side', date: 'Jan 10, 2025', price: '$89.99' },
  { src: makePartSVG('Oil & Filter Kit', 'Engine · Jiffy Lube', '$34.99', 'Mar 15, 2025', '#f59e0b'), label: 'Oil & Filter Kit', part: 'Engine', date: 'Mar 15, 2025', price: '$34.99' },
  { src: makePartSVG('Air Filter', 'Cold Air Intake · AutoZone', '$19.99', 'Mar 15, 2025', '#3b82f6'), label: 'Air Filter', part: 'Intake System', date: 'Mar 15, 2025', price: '$19.99' },
  { src: makePartSVG('Tires - Set of 4', 'All Corners · Discount Tire', '$520.00', 'Nov 5, 2024'), label: 'Tires (Set of 4)', part: 'All Corners', date: 'Nov 5, 2024', price: '$520.00' },
  { src: makePartSVG('Car Battery', 'Engine Bay · Firestone', '$149.99', 'Aug 22, 2024', '#8b5cf6'), label: 'Car Battery', part: 'Engine Bay', date: 'Aug 22, 2024', price: '$149.99' },
  { src: makePartSVG('Wiper Blades', 'Front Windshield · AutoZone', '$24.99', 'Jun 1, 2025', '#10b981'), label: 'Wiper Blades', part: 'Front Windshield', date: 'Jun 1, 2025', price: '$24.99' },
]

const VidCamCapture = () => {
  const webcamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const [images, setImages] = useState([])
  const [savedVideos, setSavedVideos] = useState([])
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [view, setView] = useState('images')
  const [camReady, setCamReady] = useState(false)
  const [camError, setCamError] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('capturedImages') || '[]')
    setImages(stored.length ? stored : DUMMY_IMAGES)
    // Blob URLs are session-only and cannot be restored from localStorage
  }, [])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return

    // Flash effect
    setFlash(true)
    setTimeout(() => setFlash(false), 120)

    const newImg = {
      src: imageSrc,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    // Read from localStorage directly so we never append to the dummy array
    const stored = JSON.parse(localStorage.getItem('capturedImages') || '[]')
    const updated = [...stored, newImg]
    localStorage.setItem('capturedImages', JSON.stringify(updated))
    setImages(updated)
    setView('images')
  }, [])

  const deleteImage = (i) => {
    const stored = JSON.parse(localStorage.getItem('capturedImages') || '[]')
    if (!stored.length) {
      // We're viewing dummies — just remove from display, nothing to persist
      const updated = images.filter((_, idx) => idx !== i)
      setImages(updated.length ? updated : DUMMY_IMAGES)
      return
    }
    const updated = stored.filter((_, idx) => idx !== i)
    localStorage.setItem('capturedImages', JSON.stringify(updated))
    setImages(updated.length ? updated : DUMMY_IMAGES)
  }

  const downloadImage = (src, i) => {
    const a = document.createElement('a')
    a.href = src
    a.download = `capture-${i + 1}.jpg`
    a.click()
  }

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) return
    chunksRef.current = []
    setRecording(true)

    const mimeType = ['video/webm;codecs=vp9', 'video/webm', '']
      .find(t => !t || MediaRecorder.isTypeSupported(t))

    const recorder = new MediaRecorder(
      webcamRef.current.stream,
      mimeType ? { mimeType } : {}
    )
    mediaRecorderRef.current = recorder

    // Use a ref for chunks — avoids React batching losing data
    recorder.ondataavailable = ({ data }) => {
      if (data.size > 0) chunksRef.current.push(data)
    }

    // Auto-save when recording fully stops
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const size = blob.size > 1024 * 1024
        ? `${(blob.size / 1024 / 1024).toFixed(1)} MB`
        : `${(blob.size / 1024).toFixed(0)} KB`
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      setSavedVideos(prev => [...prev, { url, size, date }])
      setProcessing(false)
      setView('videos')
      chunksRef.current = []
    }

    recorder.start(250) // collect data every 250ms
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    setProcessing(true)
  }, [])

  const deleteVideo = (i) => {
    setSavedVideos(prev => {
      URL.revokeObjectURL(prev[i].url)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const downloadVideo = (url, i) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `video-${i + 1}.webm`
    a.click()
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-950 min-h-screen pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Captures</h1>
            <p className="text-gray-400 mt-1">Take photos and record videos of your vehicle</p>
          </div>

          {/* Webcam panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
            <div className="relative bg-black">
              {camError ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-sm font-medium text-gray-400">Camera not available</p>
                  <p className="text-xs mt-1 text-gray-600">Allow camera access in your browser settings and refresh</p>
                </div>
              ) : (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-t-2xl"
                    style={{ maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    onUserMedia={() => setCamReady(true)}
                    onUserMediaError={() => setCamError(true)}
                  />
                  {/* Camera flash */}
                  {flash && (
                    <div className="absolute inset-0 bg-white rounded-t-2xl pointer-events-none" style={{ opacity: 0.75 }} />
                  )}
                  {/* Status badge */}
                  {recording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">Recording</span>
                    </div>
                  )}
                  {processing && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">Saving video…</span>
                    </div>
                  )}
                  {!camReady && !camError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-t-2xl">
                      <p className="text-gray-400 text-sm">Starting camera…</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 flex flex-wrap gap-3">
              <button
                onClick={capture}
                disabled={!camReady || recording || processing}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                <FontAwesomeIcon icon={faCamera} /> Capture Photo
              </button>

              {recording ? (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
                >
                  <FontAwesomeIcon icon={faStop} /> Stop &amp; Save Video
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={!camReady || processing}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
                >
                  <FontAwesomeIcon icon={faCircle} className="text-red-500" /> Record Video
                </button>
              )}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6">
            {['images', 'videos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === tab ? 'bg-red-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'images' ? `📸 Photos (${images.length})` : `🎥 Videos (${savedVideos.length})`}
              </button>
            ))}
          </div>

          {/* Photos gallery */}
          {view === 'images' && (
            images.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">📸</div>
                <p>No photos captured yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group">
                    <div className="relative">
                      <img
                        src={img.src}
                        alt={img.label || `Photo ${i + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => downloadImage(img.src, i)}
                          className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                        >
                          <FontAwesomeIcon icon={faDownload} className="text-white text-sm" />
                        </button>
                        <button
                          onClick={() => deleteImage(i)}
                          className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-white text-sm" />
                        </button>
                      </div>
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-white text-sm font-medium">{img.label || `Photo ${i + 1}`}</p>
                      {img.part
                        ? <p className="text-gray-500 text-xs mt-0.5">{img.part}{img.date ? ` · ${img.date}` : ''}</p>
                        : img.date && <p className="text-gray-500 text-xs mt-0.5">{img.date}</p>
                      }
                      {img.price && <p className="text-green-400 text-xs font-semibold mt-1">{img.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Videos gallery */}
          {view === 'videos' && (
            savedVideos.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">🎥</div>
                <p>No videos recorded yet</p>
                <p className="text-xs mt-2 text-gray-600">Click "Record Video" above to start</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-xs mb-4">Videos are available for download this session</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedVideos.map((vid, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                      <video controls src={vid.url} className="w-full h-48 bg-black" />
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm font-medium">Video {i + 1}</p>
                          <p className="text-gray-500 text-xs">{vid.size}</p>
                        </div>
                        {vid.date && <p className="text-gray-500 text-xs mb-3">{vid.date}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadVideo(vid.url, i)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faDownload} /> Download
                          </button>
                          <button
                            onClick={() => deleteVideo(i)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-sm py-2 rounded-lg transition-all"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default VidCamCapture
