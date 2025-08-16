import { sql } from '../../lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mealTypes = await sql.unsafe(`
    SELECT 
        id, 
        name, 
        start_time, 
        end_time 
    FROM meal_types
    WHERE is_active = true
    ORDER BY start_time
    `);
    
    return NextResponse.json(mealTypes);
  } catch (error) {
    console.error('Error fetching meal types:', error);
    return NextResponse.json(
      { error: 'Error al obtener los tipos de comida' }, 
      { status: 500 }
    );
  }
}