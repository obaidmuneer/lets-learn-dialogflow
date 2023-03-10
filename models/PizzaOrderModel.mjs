import { Schema, model } from 'mongoose'

const PizzaOrderderSchema = new Schema({
    name: { type: String },
    address: { type: String, },
    item: { type: String },
    qty: { type: String, required: true },
    flavor: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
})

export default model('pizzaOrders', PizzaOrderderSchema)
