import { http, HttpResponse } from 'msw';

interface UserData {
  username: string,
  password: string
}
export const handlers = [
  http.post('/register', () => {
    return new HttpResponse('{"status":"REgistered"}')
  }),

  http.post('/login', async ({ request }) => {
    const data = await request.json() as UserData
    if (data.username !== 'hector.tazdevil@gmail.com') {
      return HttpResponse.json({ success: false }, { status: 401 })
    }

    return HttpResponse.json({ success: true })
  })
];
