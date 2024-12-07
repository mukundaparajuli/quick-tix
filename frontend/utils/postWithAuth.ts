import { Session } from "next-auth";


/**
 * @description postWithAuth is a service to ease the post request with authorization
 * @param url 
 * @param data 
 * @param session 
 * @returns response.json()
 * @example postWithAuth(`${BACKEND_URL}/api/`, session)
 */
export default async function postWithAuth(url: string, data: any, session: Session | null) {
    console.log("frontend ko token= ", session?.user)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
    }
    )

    const resData = await response.json();
    if (response.ok) {
        return resData;
    }

    console.log("error occured while making a post request: ", resData);
    throw new Error("Error occured while making a post request")
}