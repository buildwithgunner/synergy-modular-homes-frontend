import { useRef, useState, useEffect } from 'react'

export default function OtpInput({ length = 6, onComplete, disabled = false }) {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputsRef = useRef([])

  useEffect(() => {
    if (otp.every((digit) => digit !== '') && onComplete) {
      onComplete(otp.join(''))
    }
  }, [otp])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // only numbers

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last character
    setOtp(newOtp)

    // move to next input
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char
    })
    setOtp(newOtp)

    const nextIndex = Math.min(pasted.length, length - 1)
    inputsRef.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition disabled:opacity-50"
        />
      ))}
    </div>
  )
}