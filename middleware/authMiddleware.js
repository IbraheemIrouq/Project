const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) 
{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) 
  {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => 
  {
    if (err) 
    {
      if (err.name === 'TokenExpiredError') 
      {
        return res.status(403).json({ message: 'Token expired' });
      }
      if (err.name === 'JsonWebTokenError') 
      {
        return res.status(403).json({ message: 'Invalid token' });
      }
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; //add user info to the request
    next();
  });
}

//middleware to check if user is admin
function isAdmin(req, res, next) 
{
  if (!req.user || req.user.role !== 'admin') 
  {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
}

module.exports = {
  authenticateToken,
  isAdmin
};
