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