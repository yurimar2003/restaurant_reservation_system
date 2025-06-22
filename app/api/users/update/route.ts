import { sql } from './../../../lib/data';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const { userId, password, ...updateData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Si solo se quiere actualizar la contraseña
    if (password) {
      if (typeof password !== 'string' || password.length < 8) {
        return NextResponse.json(
          { error: 'La contraseña debe tener al menos 8 caracteres.' },
          { status: 400 }
        );
      }
      const hashed = await bcrypt.hash(password, 10);
      const result = await sql.unsafe(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2
        RETURNING id
        `,
        [hashed, userId]
      );
      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // Actualización de otros campos
    const validFields = [
      'name', 'lastName', 'phone', 'age',
      'gender', 'birthDate', 'location'
    ];

    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (validFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      );
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id, name, email, role, phone, age, gender,
        lastname AS "lastName",
        birthdate AS "birthDate",
        location
    `;

    const result = await sql.unsafe(query, values);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...result[0],
        lastName: result[0].lastName,
        birthDate: result[0].birthDate
      }
    });

  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}