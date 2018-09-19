import { compose, withStateHandlers, withHandlers } from 'recompose'

export default compose(withStateHandlers({
  executing: false,
  topMessage: '',
  messageColor: '',
  inputMessages: []
},{
  setExecuting: () => (value) => ({ executing: value }),
  setTopMessage: () => (value) => ({ topMessage: value }),
  setMessageColor: () => (value) => ({ messageColor: value }),
  setInputMessages: () => (value) => ({ inputMessages: value })
}), withHandlers({
  preventExecute: ({ executing, setExecuting }) => () => {
    if (executing) return true
    setExecuting(true)
    return false
  },
  endExecute: ({ setExecuting }) => () => setExecuting(false)
}))
