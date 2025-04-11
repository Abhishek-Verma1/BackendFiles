import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

/*
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('token');
  console.log(token);

  console.log('process.env.JWT_SECRETin middleware');
  console.log(process.env.JWT_SECRET);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token.replace(/"/g, ''), process.env.JWT_SECRET);
  console.log('decoded');
  req.user = decoded;
};
*/

export const authenticateJWT = expressjwt({
  secret: process.env.JWT_SECRET || 'secret',
  algorithms: ['HS256'],
});
