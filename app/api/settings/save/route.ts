import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const { verifyToken, apiKey, webhookUrl } = await request.json()

    console.log("[v0] Saving settings to database")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured")
    }

    if (!verifyToken) {
      return NextResponse.json(
        { error: "Verify token is required" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL)
    const userId = "default-user"

    // Use the correct column names from the existing table
    const result = await sql`
      INSERT INTO settings (user_id, webhook_verify_token, access_token, updated_at) 
      VALUES (${userId}, ${verifyToken}, ${apiKey || null}, NOW())
      ON CONFLICT (user_id) DO UPDATE 
      SET 
        webhook_verify_token = EXCLUDED.webhook_verify_token,
        access_token = EXCLUDED.access_token,
        updated_at = NOW()
      RETURNING *
    `

    console.log("[v0] Settings saved successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: result[0],
    })
  } catch (error) {
    console.error("[v0] Error saving settings:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save settings",
      },
      { status: 500 }
    )
  }
}
