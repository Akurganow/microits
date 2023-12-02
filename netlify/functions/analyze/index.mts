import type {Config, Context} from "@netlify/functions"

export default async (req: Request, context: Context) => {
    const { tasks, language } = await req.json()

    const message = `Please analyze next stringified json "${JSON.stringify(tasks)}" and give me some ideas. in "${language}" language`

    return new Response(
        JSON.stringify({ message }),
        {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            }
        })
}

export const config: Config = {
    path: "/api/analyze"
};