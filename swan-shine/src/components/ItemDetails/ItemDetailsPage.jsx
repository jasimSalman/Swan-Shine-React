import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import ItemDetailsCard from './ItemDetailsCard'
import './ItemDetailsPage.css'
import Client, { BASE_URL } from '../../services/api'

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const userType = localStorage.getItem('userType')

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items/show/${id}`)
      setItem(response.data)
      fetchReviews()
      setLoading(false)
    } catch (error) {
      console.error('Error fetching the item details:', error)
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items/${id}/reviews`)
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  useEffect(() => {
    fetchItemDetails()
  }, [id])

  const handleAddToCart = async (item) => {
    try {
      await Client.post(`${BASE_URL}/cart/${userId}`, {
        items: [{ item: item, quantity: 1 }]
      })
      navigate('/cart')
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }
  }

  const handleAddReview = (review) => {
    setItem((prevItem) => ({
      ...prevItem,
      reviews: [...prevItem.reviews, review]
    }))
    setReviews((prevReviews) => [...prevReviews, review])
    setIsReviewModalOpen(false)
    fetchReviews()
  }

  const handleDelete = async (reviewId) => {
    try {
      await Client.delete(`${BASE_URL}/items/reviews/${reviewId}`)
      setReviews(reviews.filter((review) => review._id !== reviewId))
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <div>Error loading item details</div>
  }

  return (
    <div className="item-details-page">
      <h1>Item Details</h1>
      <ItemDetailsCard
        item={item}
        onAddToCart={handleAddToCart}
        onAddReview={() => setIsReviewModalOpen(true)}
        onRequestClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleAddReview}
        isOpen={isReviewModalOpen}
      />

      <div className="reviews-container">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review._id}>
                <p>{review.content}</p>
                <Rating rating={review.rating} />
                <p>{review.user.username}</p>
                {userType === 'user' && userId === review.user._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="deleteReview"
                  >
                    Delete Review
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ItemDetailsPage
