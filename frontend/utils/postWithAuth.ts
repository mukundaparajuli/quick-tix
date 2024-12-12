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
    console.log("json.stringify= ", JSON.stringify(data))
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

/**
 * @description postWithAuth is a service to ease the post request with authorization when data is formdata
 * @param url 
 * @param data 
 * @param session 
 * @returns response.json()
 * @example postWithAuth(`${BACKEND_URL}/api/`, session)
 */
export async function postWithAuthFormData(url: string, data: any, session: Session | null) {
    for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
        body: data
    }
    )

    const resData = await response.json();
    console.log(resData)
    if (response.ok) {
        return resData;
    }

    console.log("error occured while making a post request: ", resData);
    throw new Error("Error occured while making a post request")
}