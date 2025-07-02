import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const googleRes = await fetch("https://script.google.com/macros/s/AKfycbxywQi94ZJ_OkQiZDoxwH5iFwwsoJwoDbK46-Z3UiQc6reSkEGVd7XoOkQoI30rvdk/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log('google res ',googleRes);
    
    const text = await googleRes.text();

    if (!googleRes.ok) {
      return NextResponse.json(
        { success: false, error: "Google Script error", response: text },
        { status: googleRes.status }
      );
    }

    return NextResponse.json({ success: true, message: text });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ success: false, error: "Proxy failed" }, { status: 500 });
  }
}
