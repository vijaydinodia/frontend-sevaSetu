import React, { useState } from 'react'
import axios from 'axios'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import API_URL from '../api'
import Button from './ui/Button'

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const token = localStorage.getItem('token')
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setMessage('Please select a rating from 1 to 5 stars.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await axios.post(
        `${API_URL}/user/review`,
        {
          bookingId: booking._id,
          rating,
          review: reviewText,
        },
        getHeaders()
      )

      setMessage(res.data.message || 'Review submitted successfully')
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1000)
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* modal box */}
      <div className="relative w-full max-w-lg rounded-[28px] bg-white shadow-2xl">
        {/* close button */}
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          onClick={onClose}
          type="button"
        >
          <CloseOutlinedIcon fontSize="small" />
        </button>

        {/* gradient top bar */}
        <div className="h-1.5 w-full rounded-t-[28px] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />

        <div className="p-6 md:p-8">
          <h2 className="mb-2 text-2xl font-semibold text-black">Rate Your Service</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Leave a review for booking #{booking.bookingNumber}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Rating Stars */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    {rating >= star ? (
                      <StarRateRoundedIcon className="text-amber-500" fontSize="large" />
                    ) : (
                      <StarOutlineRoundedIcon className="text-zinc-300" fontSize="large" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
              </span>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Additional Feedback (Optional)
              </label>
              <textarea
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                rows="4"
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            {/* message */}
            {message && (
              <p className={`mt-4 text-center text-sm font-semibold ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            {/* buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
