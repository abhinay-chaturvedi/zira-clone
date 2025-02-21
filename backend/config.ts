
import dotenv from "dotenv";
dotenv.config()
export const config = {
    PORT: process.env.PORT || 5000,
    AUTH_COOKIE: "chaturvedi-zira-clone-session",
    APP_URL: "http://localhost:3000",
    APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID!,
    APPWRITE_WORKSPACES_ID: process.env.APPWRITE_WORKSPACES_ID!,
    APPWRITE_MEMBERS_ID: process.env.APPWRITE_MEMBERS_ID!,
    APPWRITE_IMAGES_BUCKET_ID: process.env.APPWRITE_IMAGES_BUCKET_ID!,
    APPWRITE_PROJECTS_ID: process.env.APPWRITE_PROJECTS_ID!,
    APPWRITE_TASKS_ID: process.env.APPWRITE_TASKS_ID!,
}