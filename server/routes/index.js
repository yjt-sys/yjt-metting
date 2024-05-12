var express = require('express');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();
var socketIo = require('socket.io');
var io;
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

// module.exports = router;
module.exports = {
  indexRouter:router,
  init: function (server) {
    //初始化房间和用户
    // 传递server对象，初始化一个io实例
    const io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    // 服务器监听客户端socketIo连接
    io.on('connection', (socket) => {
      console.log(`用户已实现socket连接${socket.id}`);

      socket.on('create-new-room', (data) => {
        createNewRoomHandler(data, socket);
      });

      socket.on('join-room', (data) => {
        joinRoomHandler(data, socket);
      });

      socket.on('disconnect', () => {
        disconnectHandler(socket);
      });
      //接收客户端发送过来的信令数据并转发
      socket.on('conn-signal', (data) => {
        signalingHandler(data, socket);
      });
      //当另一方信令接收完成之后，需要返回给发起方
      socket.on('conn-init', (data) => {
        initializeConnectionHandler(data, socket);
      });
      socket.on('direct-message', (data) => {
        directMessageHandler(data, socket);
      });
    });

    // socket.io handler
    const createNewRoomHandler = (data, socket) => {
      console.log('主持人正在创建会议房间...');

      const { identity, onlyAudio } = data;

      const roomId = uuidv4();

      //创建新用户（进入会议的人）
      const newUser = {
        identity,
        id: uuidv4(),
        roomId,
        socketId: socket.id,
        onlyAudio,
      };
      //将新用户添加到已连接的用户数组里面
      connectedUsers = [...connectedUsers, newUser];

      //创建新会议房间
      const newRoom = {
        id: roomId,
        connectedUsers: [newUser],
      };

      //新用户加入会议房间
      socket.join(roomId);
      rooms = [...rooms, newRoom];

      //向客户端发送数据告知会议房间已创建（roomId）
      socket.emit('room-id', { roomId });

      //发送通知告知有新用户加入并更新房间
      socket.emit('room-update', { connectedUsers: newRoom.connectedUsers });
    };

    const joinRoomHandler = (data, socket) => {
      const { roomId, identity, onlyAudio } = data;

      const newUser = {
        identity,
        id: uuidv4(),
        roomId,
        socketId: socket.id,
        onlyAudio,
      };

      //判断传递过来的roomId是否匹配对应会议房间
      const room = rooms.find((room) => room.id === roomId);
      room.connectedUsers = [...room.connectedUsers, newUser];

      //加入房间
      socket.join(roomId);

      //将新用户添加到已连接的用户数组里面
      connectedUsers = [...connectedUsers, newUser];

      //告知除自己以外的所有已连接用户准备webRTC对等连接
      room.connectedUsers.forEach((user) => {
        //排除自身
        if (user.socketId !== socket.id) {
          //存储发起对等连接方的socketId信息
          const data = {
            connUserSocketId: socket.id,
          };
          io.to(user.socketId).emit('conn-prepare', data);
        }
      });

      //发送通知告知有新用户加入并更新房间
      io.to(roomId).emit('room-update', { connectedUsers: room.connectedUsers });
    };

    const disconnectHandler = (socket) => {
      //查询要离开会议房间的用户
      const user = connectedUsers.find((user) => user.socketId === socket.id);

      if (user) {
        //从会议房间进行删除
        const room = rooms.find((room) => room.id === user.roomId);

        room.connectedUsers = room.connectedUsers.filter(
          (user) => user.socketId !== socket.id
        );

        //离开房间
        socket.leave(user.roomId);

        //当会议房间没有人员的时候要关闭整个会议室（从rooms数组中删除该房间的信息）
        if (room.connectedUsers.length > 0) {
          //用户断开WebRTC连接
          io.to(room.id).emit('user-disconected', { socketId: socket.id });

          //发送通知告知有用户离开并更新房间
          io.to(room.id).emit('room-update', {
            connectedUsers: room.connectedUsers,
          });
        } else {
          //从rooms数组中删除该房间的信息
          rooms = rooms.filter((r) => r.id !== room.id);
        }
      }
    };

    //转发信令
    const signalingHandler = (data, socket) => {
      const { connUserSocketId, signal } = data;

      const signalingData = { signal, connUserSocketId: socket.id };
      io.to(connUserSocketId).emit('conn-signal', signalingData);
    };

    //给发起端发送信令
    const initializeConnectionHandler = (data, socket) => {
      const { connUserSocketId } = data;

      const initData = { connUserSocketId: socket.id };
      io.to(connUserSocketId).emit('conn-init', initData);
    };

    const directMessageHandler = (data, socket) => {
      if (
        connectedUsers.find(
          (connUser) => connUser.socketId === data.receiverSocketId
        )
      ) {
        //信息发送给接收方
        const receiverData = {
          authorSocketId: socket.id,
          messageContent: data.messageContent,
          isAuthor: false,
          identity: data.identity,
        };
        socket.to(data.receiverSocketId).emit('direct-message', receiverData);

        //信息返回给发送方
        const authorData = {
          receiverSocketId: data.receiverSocketId,
          messageContent: data.messageContent,
          isAuthor: true,
          identity: data.identity,
        };
        socket.emit('direct-message', authorData);
      }
    };
    return io;
  },
  getIo: function () {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};

