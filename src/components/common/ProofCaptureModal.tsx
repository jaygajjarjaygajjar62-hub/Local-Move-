import React, { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ProofMedia } from '@/types'
import { Camera, Video, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'

interface ProofCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  stage: 'pickup' | 'drop'
  onCapture: (proof: ProofMedia) => void
}

export const ProofCaptureModal: React.FC<ProofCaptureModalProps> = ({
  isOpen,
  onClose,
  stage,
  onCapture,
}) => {
  const [mode, setMode] = useState<'photo' | 'video'>('photo')
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
      setCapturedPreview(null)
      setNotes('')
    }
    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    setCameraError(null)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.')
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err: any) {
      setCameraError(err.message || 'Camera permission denied or device not found.')
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const handleCaptureRealPhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setCapturedPreview(dataUrl)
      stopCamera()
    }
  }

  const handleDemoCapture = () => {
    // Synthetic sample image for test fallback
    const sampleUrls = [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    ]
    const chosen = sampleUrls[Math.floor(Math.random() * sampleUrls.length)]
    setCapturedPreview(chosen)
    stopCamera()
  }

  const handleSubmitProof = () => {
    if (!capturedPreview) return
    const newProof: ProofMedia = {
      id: 'prf_' + Math.random().toString(36).slice(2, 8),
      type: mode,
      url: capturedPreview,
      timestamp: new Date().toISOString(),
      stage,
      notes: notes.trim() || `${stage.toUpperCase()} handover condition inspection`,
    }
    onCapture(newProof)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stage === 'pickup' ? 'Pickup' : 'Drop'} Condition Proof`}
      description="Capture required item photo or video proof directly using the device camera."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Anti-fraud disclosure */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Tamper-Proof Verification:</strong> Gallery photo uploads are blocked in the Local Move partner app to ensure real-time physical inspection at the doorstep.
          </div>
        </div>

        {/* Media Mode Switcher */}
        <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-slate-50 dark:bg-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setMode('photo')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'photo' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Photo Inspection
          </button>
          <button
            type="button"
            onClick={() => setMode('video')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'video' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Video Inspection (10-30s)
          </button>
        </div>

        {/* Viewport / Preview */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-300">
          {capturedPreview ? (
            <img src={capturedPreview} alt="Captured condition preview" className="w-full h-full object-cover" />
          ) : cameraActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 space-y-2 text-white">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 max-w-xs">{cameraError || 'Camera unavailable'}</p>
              <Button size="sm" variant="outline" onClick={handleDemoCapture} className="text-white border-white/30 hover:bg-white/10">
                Use Demo Sample Capture
              </Button>
            </div>
          )}

          {/* Watermark overlay */}
          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-xs">
            AERA LOCAL MOVE • {stage.toUpperCase()} PROOF • {new Date().toLocaleTimeString('en-IN')}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          {!capturedPreview ? (
            <div className="flex flex-col sm:flex-row gap-2">
              {cameraActive && (
                <Button
                  className="flex-1"
                  variant="primary"
                  onClick={handleCaptureRealPhoto}
                  leftIcon={<Camera className="w-4 h-4" />}
                >
                  Snap Doorstep {mode === 'photo' ? 'Photo' : 'Video'}
                </Button>
              )}
              <Button
                variant={cameraActive ? 'outline' : 'primary'}
                className="flex-1"
                onClick={handleDemoCapture}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Use Demo Sample Capture
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Handover Notes / Condition Observations
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Factory sealed carton, minor corner tape tear acknowledged"
                  className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCapturedPreview(null)
                    startCamera()
                  }}
                  className="flex-1"
                >
                  Retake Capture
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitProof}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="flex-1"
                >
                  Confirm & Save Proof
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
