import { pool } from "../../../config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await pool.query("SELECT * FROM records");
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
      date,
      stocks,
      marketValue,
      total,
    } = await request.json();

    const query = `
      INSERT INTO records 
      (name, address, business, gstNumber, sgst, cgst, date, stocks, marketValue, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
      date,
      stocks,
      marketValue,
      total,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      id: result.insertId,
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
      date,
      stocks,
      marketValue,
      total,
    });
  } catch (error) {
    console.error("Error saving record:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
