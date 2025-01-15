import mongoose from "mongoose"

export const conectaDB = async (url, db) => {
    try {
        await mongoose.connect(
            url,
            {
                dbName: db
            }
        )
        console.log("DB Online!")
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }

}