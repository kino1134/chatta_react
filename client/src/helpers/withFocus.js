import { compose, withStateHandlers, withHandlers } from 'recompose'

export default ({ stateName, className }) => {
  return compose(withStateHandlers({
    [stateName]: false
  }, {
    setFocus: () => () => ({ [stateName]: true }),
    setBlur: () => () => ({ [stateName]: false })
  }), withHandlers({
    getFocusClass: (props) => () =>
      props[stateName] ? className : ''
  }))
}
