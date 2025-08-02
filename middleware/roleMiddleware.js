//check if user has allowed role
function authorizeRoles(...roles) 
{
  return (req, res, next) => 
  {
    //if no user or role not allowed
    if (!req.user || !roles.includes(req.user.role)) 
    {
      return res.status(403).json({ message: 'access denied' });
    }

    next(); 
  };
}

module.exports = authorizeRoles;
