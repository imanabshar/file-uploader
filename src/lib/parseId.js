function parseId(id, res) {
  const parsed = parseInt(id);

  // if id is anything apart from a valid number
  if (isNaN(parsed)) {
    res.status(400).render('errorPage', {
      message: 'Invalid request',
    });
    return null;
  }

  return parsed;
}

export default parseId;
