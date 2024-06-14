import { pool } from "../../../config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await pool.query("SELECT * FROM customers");
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { name, address, business, gstNumber, sgst, cgst } = await request.json();

    const result = await pool.query("INSERT INTO customers SET ?", {
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
    });

    return NextResponse.json({ id: result.insertId, name, address, business, gstNumber, sgst, cgst });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, name, address, business, gstNumber, sgst, cgst } = await request.json();

    await pool.query("UPDATE customers SET ? WHERE id = ?", [{
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
    }, id]);

    return NextResponse.json({ id, name, address, business, gstNumber, sgst, cgst });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await pool.query("DELETE FROM customers WHERE id = ?", [id]);

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}