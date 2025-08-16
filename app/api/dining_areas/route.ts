import { sql } from '../../lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dining_areas = await sql.unsafe(`
    SELECT 
        id, 
        name, 
        description, 
        is_active
    FROM dining_areas
    WHERE is_active = true
    `);
    
    return NextResponse.json(dining_areas);
  } catch (error) {
    console.error('Error fetching dining areas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las areas del restaurante' }, 
      { status: 500 }
    );
  }
}