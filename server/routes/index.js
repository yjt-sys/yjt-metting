var express = require('express');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();

//初始化房间和用户
let connectedUsers = [];
let rooms = [];

//创建路由验证房间是否存在
router.get('/api/room-exists/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    //房间存在
    if (room.connectedUsers.length > 3) {
      //房间人数已满
      return res.send({ roomExists: true, full: true });
    } else {
      //房间可以加入
      return res.send({ roomExists: true, full: false });
    }
  } else {
    //房间不存在
    return res.send({ roomExists: false });
  }
});



module.exports = router;
