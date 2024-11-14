import { Session } from "next-auth";

export default async function postWithAuth(url: string, data: any, session: Session | null) {
    console.log(url)
    console.log(data)
    console.log(session)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
    }
    )
    console.log(await response.json())

    if (response.ok) {
        return await response.json();
    }

    console.log("error occured while making a post request");
    throw new Error("Error occured while making a post request")
}