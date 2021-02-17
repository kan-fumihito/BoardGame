var connection = ""
var first_flag = true

// connection start
function start() {
    message.innerHTML = "対戦相手を探しています..."
    connection = new WebSocket('ws://board.game-app.work:5775')
    document.getElementById("start_btn").disabled = true
    connection.onopen = function(e) {
        first_flag = true

        console.log("connection start")
    }

    connection.onerror = function(error) {
        message.innerHTML = "接続エラーが起きました"
        console.log("connection error")
        document.getElementById("start_btn").disabled = false
        document.getElementById("test").value = "Error"
    }

    connection.onmessage = function(e) {
        console.log(e.data)
        if (e.data == "disconnect") {
            alert("切断されました")
            connection.close()
            return
        }
        var data = JSON.parse(e.data);
        if (first_flag) {
            message.innerHTML = "対戦相手が見つかりました"
            turn = parseInt(e.data, 10)
            if (turn == 1) {
                myturn = "2"
                oppturn = "1"
                frameColor = "#FCC600"
                backColor = "#00C6FC"
            } else {
                myturn = "1"
                oppturn = "2"
                frameColor = "#00C6FC"
                backColor = "#FCC600"
            }
            initialize_all()
            first_flag = false
            change_turn()
        } else {

            var xx = data.xx
            var yy = data.yy
            var x = data.x
            var y = data.y
            var piece = data.size
            var vict = data.vict
            var sur = data.surrender

            if (sur) {
                message.innerHTML = "あなたの勝ちです。";
                connection.close()
                return
            } else {
                if (xx > -1) // move from table
                {
                    board_st[yy][xx].pop()
                } else {
                    console.log("OK")
                    res_op[piece]--;
                    document.getElementById("ops_l").textContent = "S×" + res_op[1].toString();
                    document.getElementById("opm_l").textContent = "M×" + res_op[2].toString();
                    document.getElementById("opl_l").textContent = "L×" + res_op[3].toString();
                }
                board_st[y][x].push(-piece)
                board_map_set()
                if (vict) {
                    connection.close()
                }
            }

            change_turn()
        }
    }

    connection.onclose = function() {
        document.getElementById("start_btn").disabled = false
        first_flag = true
        console.log("connection end")
    }
}

// send data
function send(s) {
    connection.send(JSON.stringify(s))
    console.log("send");
}

// surrender button
function surrender() {
    message.innerHTML = "あなたの負けです。";

    var s = {
        "xx": -1,
        "yy": -1,
        "x": 0,
        "y": 0,
        "size": 0,
        "vict": -1,
        "surrender": true
    }
    connection.send(JSON.stringify(s))
    document.getElementById("start_btn").disabled = false
    first_flag = true
    connection.close()
}