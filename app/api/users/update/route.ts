// app/api/users/update/route.ts
import { sql } from './../../../lib/data';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { userId, ...updateData } = await request.json();

    // Validación básica
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Construir la consulta de forma segura
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

    // Añadir userId al final para WHERE
    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, role
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
      user: result[0]
    });

  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}