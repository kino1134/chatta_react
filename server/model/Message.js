import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
  // TODO: ユーザを消したい時に問題になるかも
  // TODO: また、N+1問題に似たことが起こるかも
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
    let fields = ['id', 'content', 'createdAt']

    if (full) {
      fields = [...fields, 'updatedAt']
    }

    view.user = this.user.view(full)
    fields.forEach(field => { view[field] = this[field] })
    return view
  }
}

const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
