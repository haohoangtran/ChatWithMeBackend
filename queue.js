const Database = require('./database')
const Utils = require('./utils')

class Queue {

    constructor() {
        this.QUEUE_WAIT_CHAT = [];
        setInterval(() => {
            if (this.QUEUE_WAIT_CHAT.length >= 2) {
                let connect = this.QUEUE_WAIT_CHAT.splice(0, 2);
                let user1 = connect[0], user2 = connect[1];
                Database.updateConnected(user1, user2, () => {
                    console.log("connect ", user2, " ", user1)
                    //TODO: thông báo kết nối thành công!
                    Database.findUser(user1, (u) => {
                        Utils.pushNotification(u.token, "Chú ý", "Người lạ đã tham gia cuộc trò truyện! ", {
                            title: "Chú ý",
                            body: "Người lạ đã tham gia cuộc trò truyện"
                        })
                    });
                    Database.findUser(user2, (u) => {
                        Utils.pushNotification(u.token, "Chú ý", "Người lạ đã tham gia cuộc trò truyện! ", {
                            title: "Chú ý",
                            body: "Người lạ đã tham gia cuộc trò truyện"
                        })
                    });
                });
            }
        }, 1000)
    }

    addMember(id) {
        if (!this.QUEUE_WAIT_CHAT.includes(id))
            this.QUEUE_WAIT_CHAT.push(id);
    }
}


module.exports = new Queue()