import mongoose from 'mongoose'
import { mongo } from '../'

mongoose.set('debug', mongo.debug)

// ObjectIdの表示用メソッド
mongoose.Types.ObjectId.prototype.view = function () {
  return { id: this.toString() }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:' + err)
  process.exit(-1)
})

export default mongoose
