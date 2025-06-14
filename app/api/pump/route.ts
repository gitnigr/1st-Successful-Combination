import { getPumpList } from "common/api";

export async function GET( _request: Request) {
  try {
    const data = await getPumpList()
    return Response.json(data)
  } catch (error) {
    console.error('API Error:', error)
    // Return error response that SWR can handle
    return Response.json(
      { error: 'Failed to fetch pump data' }, 
      { status: 500 }
    )
  }
}