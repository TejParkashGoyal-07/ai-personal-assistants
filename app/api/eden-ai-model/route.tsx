import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON from the request body
    const { provider, userInput } = await req.json();

    // Set API request headers and URL
    const headers = {
      Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    };
    const url = "https://api.edenai.run/v2/multimodal/chat";

    // Prepare the request body
    const body = JSON.stringify({
      providers: [provider],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              content: {
                text: userInput, // Use userInput instead of hardcoded "HEY"
              },
            },
          ],
        },
      ],
    });

    // Make the POST request
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse JSON from the response
    const result = await response.json();
    console.log(result);
    const resp={
        role:'Assistant',
        content:result[provider].generate_text
    }
    // Return the result as JSON
    return NextResponse.json(resp, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
