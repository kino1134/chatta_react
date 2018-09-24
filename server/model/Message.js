import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

messageSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'content', 'createdAt', 'updatedAt']

    if (full) {
      fields = [...fields]
    }

    if (this.user === null) {
      view.user = { displayName: '削除ユーザ', photo: 'favicon.ico' }
    } else {
    view.user = this.user.view(full)
    }
    fields.forEach(field => { view[field] = this[field] })
    return view
  }
}

const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
