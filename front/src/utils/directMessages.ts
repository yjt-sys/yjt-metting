import store from '../store';
import { setDirectChatHistory,directChatHistoryProps } from '../store/modules/app';
interface NewMessageToChatHistory{
    isAuthor: boolean;
    receiverSocketId: string;
    authorSocketId:string;
    messageContent:string;
    identity:string;
}
export const appendNewMessageToChatHistory = (data:NewMessageToChatHistory) => {
  const { isAuthor, receiverSocketId, authorSocketId } = data;

  //根据isAuhtor的值判断历史记录应该存储在那个用户（接收方/发送方）的历史记录里面
  if (isAuthor) {
    //作为消息的发送方去存储历史记录
    appendMessageToChatHistory(receiverSocketId, data);
  } else {
    //作为消息的接收方去存储历史记录
    appendMessageToChatHistory(authorSocketId, data);
  }
};

const appendMessageToChatHistory = (userSocketId:string, data:NewMessageToChatHistory) => {
  //找到存储在store中的历史记录 --> directChatHistory:[]
  const chatHistory: directChatHistoryProps[] = [...store.getState().app.directChatHistory];
  console.log(chatHistory);
  //找到其中某个用户的历史记录 -->userSocketId
  const userChatHistory = chatHistory.find(
    (history) => history.socketId === userSocketId
  );

  //验证userChatHistory是否存在
  if (userChatHistory) {
    //如果存在历史记录就将新获取的消息添加进入
    //创建获取的新会话
    const newDirectMessage = {
      isAuthor: data.isAuthor,
      messageContent: data.messageContent,
      identity: data.identity,
    };
    //创建新的用户历史记录
    const newUserChatHistory = {
      ...userChatHistory,
      chatHistory: [...userChatHistory.chatHistory, newDirectMessage],
    };

    //替换掉用户上一次的历史记录
    const newChatHistory = [
      ...chatHistory.filter((history) => history.socketId !== userSocketId),
      newUserChatHistory,
    ];
    //同步到store中
    store.dispatch(setDirectChatHistory(newChatHistory));
  } else {
    //如果历史记录不存在就重新创建该用户的历史记录
    const newUserChatHistory = {
      socketId: userSocketId,
      chatHistory: [
        {
          isAuthor: data.isAuthor,
          messageContent: data.messageContent,
          identity: data.identity,
        },
      ],
    };
    const newChatHistory = [...chatHistory, newUserChatHistory];
    //同步更新到store中
    store.dispatch(setDirectChatHistory(newChatHistory));
  }
};
