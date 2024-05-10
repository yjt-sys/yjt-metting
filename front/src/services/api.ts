import instance from './index'

interface ResponseProps{
    roomExists:boolean
    full?:boolean
}
export async function getRoomExists(roomIdValue:string) {
    const res =await instance.get<ResponseProps>({
        url:`/room-exists/${roomIdValue}`
    })
    return res
}