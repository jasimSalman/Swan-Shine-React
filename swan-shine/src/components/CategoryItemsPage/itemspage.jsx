import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import ItemsCard from '../Shared/ItemsCard'
import { BASE_URL } from '../../services/api'

const ItemsPage = () => {
  const { id } = useParams()
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchItems()
  }, [id])

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items/${id}`)
      setItems(response.data)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('No items in this category')
      } else {
        console.error(`Error fetching items for category ${id}:`, error)
      }
    }
  }

  return (
    <div className="category-items-page">
      {items.length > 0 ? (
        <ItemsCard items={items} />
      ) : (
        <p>No items found for this category.</p>
      )}
    </div>
  )
}

export default ItemsPage
