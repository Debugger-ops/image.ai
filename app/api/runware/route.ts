// app/api/runware/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, resolution = '512x512', model = 'runware:100@1' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.RUNWARE_API_KEY) {
      console.error('❌ RUNWARE_API_KEY not found');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const [width, height] = resolution.split('x').map(Number);
    const taskUUID = crypto.randomUUID(); // ✅ UUIDv4

    const payload = [
      {
        taskType: "imageInference",
        taskUUID,
        positivePrompt: prompt,
        width,
        height,
        model,
        numberResults: 1,
        outputFormat: "WEBP",
        outputType: "dataURI", // ✅ Supported type
      },
    ];

    const runwareRes = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RUNWARE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const resText = await runwareRes.text();

    if (!runwareRes.ok) {
      return NextResponse.json(
        { error: 'Runware API error', details: resText },
        { status: runwareRes.status }
      );
    }

    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      return NextResponse.json(
        { error: 'Invalid response format', details: resText },
        { status: 500 }
      );
    }

    const result = data?.data?.[0];

    if (!result) {
      return NextResponse.json({ error: 'No image returned', details: data }, { status: 500 });
    }

    const imageUrl =
      result.imageDataURI ||
      result.imageURL ||
      (result.imageBase64 ? `data:image/webp;base64,${result.imageBase64}` : null);

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image data found', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      resolution,
      model,
      taskUUID: result.taskUUID,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
