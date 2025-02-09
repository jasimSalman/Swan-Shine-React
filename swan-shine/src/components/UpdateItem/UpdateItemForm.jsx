import { useState, useEffect } from 'react'
import Client, { BASE_URL } from '../../services/api'
import { useParams, useNavigate } from 'react-router-dom'
import './UpdateItemForm.css'

const UpdateItem = () => {
  const initialState = {
    name: '',
    image: '',
    price: 0,
    stock: 0
  }

  let navigate = useNavigate()
  const [formValues, setFormValues] = useState(initialState)
  const { itemId } = useParams()

  useEffect(() => {
    fetchItemDetails()
  }, [itemId])

  const fetchItemDetails = async () => {
    try {
      const response = await Client.get(`/items/show/${itemId}`)
      const item = response.data
      setFormValues({
        name: item.name,
        image: item.image,
        price: item.price,
        stock: item.stock
      })
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await Client.put(`/items/${itemId}`, formValues)
      setFormValues(initialState)
      navigate('/my-shop')
    } catch (error) {
      console.error('Error updating place:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="update-item-form">
        <label htmlFor="placeName" className="update-item-label">
          Item Name
        </label>
        <input
          onChange={handleChange}
          name="name"
          type="text"
          placeholder="Item Name"
          value={formValues.name}
          required
          className="update-item-inputFeild"
        />

        <label htmlFor="placePoster" className="update-item-label">
          Item Image
        </label>
        <input
          onChange={handleChange}
          name="image"
          type="text"
          placeholder="Item Image URL"
          value={formValues.image}
          required
          className="update-item-inputFeild"
        />
        <label htmlFor="placePrice" className="update-item-label">
          Item Price
        </label>
        <input
          onChange={handleChange}
          name="price"
          type="number"
          placeholder="Item Price"
          value={formValues.price}
          required
          className="update-item-inputFeild"
        />
        <label htmlFor="placeDescription" className="update-item-label">
          Stock
        </label>
        <input
          onChange={handleChange}
          name="stock"
          placeholder="Stock"
          value={formValues.stock}
          required
          className="update-item-inputFeild"
        />

        <button
          disabled={
            !formValues.name ||
            !formValues.image ||
            !formValues.price ||
            !formValues.stock
          }
          className="authButton"
        >
          Save Place
        </button>
      </form>
    </div>
  )
}

export default UpdateItem
