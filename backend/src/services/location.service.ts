import db from "../config/db";

// add location
const addLocation = async (locationData: { address: string; city: string; state: string; country: string }) => {
    console.log(locationData);
    const { address, city, state, country } = locationData;


    if (!address || !city || !state || !country) {
        throw new Error("All location fields are mandatory.");
    }

    const allLocation = await db.location.findMany();
    console.log(allLocation);
    const locationExists = await db.location.findFirst({
        where: { address, city, state, country }
    });

    if (locationExists) {
        return locationExists;
    }


    const newLocation = await db.location.create({
        data: { address, city, state, country }
    });

    return newLocation;
};

export default addLocation;