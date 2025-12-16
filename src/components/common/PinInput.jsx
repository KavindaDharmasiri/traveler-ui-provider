import React, { useState, useRef, useEffect } from 'react'

const PinInput = ({ onComplete, onCancel, title = "Enter Verification Code" }) => {
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      onComplete(newPin.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newPin = [...pin]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newPin[i] = pastedData[i]
      }
    }
    
    setPin(newPin)
    
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      onComplete(newPin.join(''))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 text-center mb-8">
          Please enter the 6-digit verification code
        </p>
        
        <div className="flex justify-center space-x-3 mb-8">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#217964] focus:outline-none transition-colors"
            />
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(pin.join(''))}
            disabled={pin.some(digit => digit === '')}
            className="flex-1 py-3 px-4 bg-[#217964] text-white rounded-lg hover:bg-[#1a5f4f] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}

export default PinInput