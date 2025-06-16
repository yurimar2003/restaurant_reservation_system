import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { sql } from 'app/lib/data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Comparar contraseñas hasheadas
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Retornar datos de usuario (sin password)
    const { password: _, ...userData } = user;
    return res.status(200).json({ user: userData });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}