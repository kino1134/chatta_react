export const showMe = ({ user }, res) =>
  res.json(user.view(true))
