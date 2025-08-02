//simple middleware to check if user is admin
module.exports = (req, res, next) => 
{
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'no token' });

  const token = authHeader.split(' ')[1];
  try 
  {
    const decoded = jwt.verify(token, 'your_jwt_secret'); 
    if (decoded.role !== 'admin') 
    {
      return res.status(403).json({ message: 'not admin' });
    }
    next();
  } 
  catch (err) 
  {
    res.status(401).json({ message: 'invalid token' });
  }
};
