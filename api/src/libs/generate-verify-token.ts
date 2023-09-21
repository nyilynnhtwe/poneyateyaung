import { hash,verify } from "argon2"

export const GenerateToken = (data : string) =>
{
    return hash(data);
}



export const VerifyToken = (hashedData : string,data : string) =>
{
    return verify(hashedData,data);
}