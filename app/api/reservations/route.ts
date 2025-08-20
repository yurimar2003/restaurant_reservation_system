import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../lib/data';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await sql`
      INSERT INTO reservations 
        (user_id, table_id, date, time, people, status, meal_type_id, area_preference_id, special_requests, comments, customer_phone, customer_name)
      VALUES 
        (${body.user_id}, ${body.table_id}, ${body.date}, ${body.time}, ${body.people}, ${body.status}, ${body.meal_type_id}, ${body.area_preference_id}, ${body.special_requests}, ${body.comments}, ${body.customer_phone}, ${body.customer_name})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    let result;
    if (userId) {
      result = await sql`
        SELECT 
          r.id,
          r.customer_name AS usuario,
          r.customer_phone AS numero_celular,
          r.date AS fecha,
          r.time AS hora,
          r.people AS comensales,
          mt.name AS tipo_comida,
          da.name AS area_preferencial,
          r.comments AS comentario,
          r.status AS estado
        FROM reservations r

        LEFT JOIN meal_types mt ON r.meal_type_id = mt.id
        LEFT JOIN dining_areas da ON r.area_preference_id = da.id
        WHERE user_id = ${userId}
        ORDER BY r.date DESC, r.time DESC
      `;
    } else {
      result = await sql`
        SELECT 
          id,
          customer_name AS usuario,
          customer_phone AS numero_celular,
          date AS fecha,
          time AS hora,
          people AS comensales,
          meal_type_id AS tipo_comida,
          area_preference_id AS area_preferencial,
          comments AS comentario,
          status AS estado
        FROM reservations
        ORDER BY date DESC, time DESC
      `;
    }

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}