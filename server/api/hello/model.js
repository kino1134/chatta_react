import mongoose, { Schema } from 'mongoose'

const helloSchema = new Schema({
  message: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

helloSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Hello', helloSchema)

export const schema = model.schema
export default model
