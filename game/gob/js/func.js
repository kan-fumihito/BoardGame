// game state variable
var turn = 0                // turn state (init:0)
var myturn = ""             // my turn first:"1", second:"2"
var oppturn = ""            // opposit turn
var board_st = new Array(3) // board_map state (3*3 stack)
var name_p = ["", "S", "M", "L"]
var id_p = ["", "s", "m", "l"]
var res_p = [0, 2, 2, 2]    // residue of piece (init:2)
var res_op = [0, 2, 2, 2]   // residue of opp piece (init:2)
var sel_p = 0               // type of selected sel_p 
var sel_x = -1              // selected position x (hand:x=-1, table:x>=0)
var sel_y = -1              // selected position y (hand:y=-1, table:y>=0)
var sel = false             // select flag

// HTML element
var pbtn = Array(3)                                 // piece select button
var ptype = document.getElementById("ptype")        // type of selected sel_p message
var turn_msg = document.getElementById('view_turn') // turn message
var message = document.getElementById("message")

// initialize variable
for (var i = 0; i < board_st.length; i++)
{
    board_st[i] = new Array(3)
    for (var j = 0; j < board_st[i].length; j++)
    {
        board_st[i][j] = new Stack()
    }
}
pbtn[0] = document.getElementById("ps")
pbtn[1] = document.getElementById("pm")
pbtn[2] = document.getElementById("pl")

// initialize all state
function initialize_all()
{
    res_p = [0, 2, 2, 2]
    res_op = [0, 2, 2, 2]
    sel_p = 0
    sel_x = -1
    sel_y = -1
    sel = false
    
    board_init()
}



// initialize board_map
function board_init ()
{
    for (var y = 0; y < 3; y++)
    {
        for (var x = 0; x < 3; x++)
        {
            board_st[y][x] = new Stack()
        }
    }
    document.getElementById("ps_l").textContent = "S×" + res_p[1].toString();
    document.getElementById("pm_l").textContent = "M×" + res_p[2].toString();
    document.getElementById("pl_l").textContent = "L×" + res_p[3].toString();
    document.getElementById("ops_l").textContent = "S×" + res_op[1].toString();
    document.getElementById("opm_l").textContent = "M×" + res_op[2].toString();
    document.getElementById("opl_l").textContent = "L×" + res_op[3].toString();
    right_p()
    board_map_set()
};

function right_p() {
    document.getElementById("MyPS").src = "image/PS" + myturn + ".png"
    document.getElementById("MyPM").src = "image/PM" + myturn + ".png"
    document.getElementById("MyPL").src = "image/PL" + myturn + ".png"
    document.getElementById("OPS").src = "image/PS" + oppturn + ".png"
    document.getElementById("OPM").src = "image/PM" + oppturn + ".png"
    document.getElementById("OPL").src = "image/PL" + oppturn + ".png"
}

// display board_map
function board_map_set () {
    var pimg = ""
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var img = document.getElementById(String(i) + String(j))
            switch( board_st[i][j].top ) {
                case 0:
                    pimg = "None"
                    break;
                case 1:
                    pimg = "PS" + myturn
                    break;
                case 2:
                    pimg = "PM" + myturn
                    break;
                case 3:
                    pimg = "PL" + myturn
                    break;
                    
                case -1:
                    pimg = "PS" + oppturn
                    break;
                case -2:
                    pimg = "PM" + oppturn
                    break;
                case -3:
                    pimg = "PL" + oppturn
                    break;
                default:
                    pimg = "None"
            }
            
            img.src = "image/" + pimg + ".png"
        }
    }
    return true
};

// change turn, and judge victory or defeat
function change_turn ()
{
    if(turn == 0)
    {
        turn = 1
        return 0
    }
    console.log("one"+String(turn));
    turn *= -1
    console.log("two"+String(turn));
    var flag = check_vict()
    if(flag == 1)
    {
        message.innerHTML = "あなたの勝ちです。";
        return 1
    }
    if(flag == -1)  
    {
        message.innerHTML = "あなたの負けです。";
        return -1
    }
    if(flag == 2)
    {
        message.innerHTML = "引き分けです。";
        return 2
    }
    
    switch( turn ) {
        case -1:
            message.innerHTML = "相手の番です。";
            break;
        case 1:
            message.innerHTML = "あなたの番です。";
            break;
    }
    return 0
};

function check_vict()
{
    var flag1 = 0
    var flag2 = 0
    var flag_tr1 = true
    var flag_tl1 = true
    var flag_tr2 = true
    var flag_tl2 = true
    for (var i = 0; i < 3; i++)
    {
        var flag_v1 = true
        var flag_h1 = true
        var flag_v2 = true
        var flag_h2 = true
        for (var j = 0; j < 3; j++)
        {
            if(flag_v1 && (board_st[j][i].top <= 0))
                flag_v1 = false
            if(flag_v2 && (board_st[j][i].top >= 0))
                flag_v2 = false
            if(flag_h1 && (board_st[i][j].top <= 0))
                flag_h1 = false
            if(flag_h2 && (board_st[i][j].top >= 0))
                flag_h2 = false
        }
        if(flag_h1 || flag_v1)
            flag1 = 1
        if(flag_h2 || flag_v2)
            flag2 = -1
            
        
        if(flag_tr1 && (board_st[i][i].top <= 0))
            flag_tr1 = false
        if(flag_tr2 && (board_st[i][i].top >= 0))
            flag_tr2 = false
        if(flag_tl1 && (board_st[i][2-i].top <= 0))
            flag_tl1 = false
        if(flag_tl2 && (board_st[i][2-i].top >= 0))
            flag_tl2 = false
    }
    if(flag_tr1 || flag_tl1)
            flag1 = 1
        if(flag_tr2 || flag_tl2)
            flag2 = -1
    if(flag1 && flag2)
        return 2
    else
        return flag1 + flag2
}

// check whether putting piece is possible or impossible
function check_put (row_index,cell_index)
{
    if(sel)
    {
        if(((sel_x < 0 && res_p[sel_p] > 0) || sel_x >= 0) && sel_p > Math.abs(board_st[row_index][cell_index].top))
        {
            board_st[row_index][cell_index].push(sel_p)
            return true
        }
    }
    return false
}

// set click event of square
function board_click(y, x){
    if (turn == 1) // my turn
    {
        if (sel) // have selected
        { 
            if((sel_x == x) && (sel_y == y))
            {
                board_st[y][x].push(sel_p)
                document.getElementById(String(y) + String(x)).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
                ptype.textContent = "_"
                sel = false
                sel_x = -1
                sel_y = -1
            }else if (check_put(y, x)){
                if(sel_x == -1)
                {
                    if(--res_p[sel_p] == 0)
                    {
                        document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + "_0.png";
                    }
                    document.getElementById("ps_l").textContent = "S×" + res_p[1].toString();
                    document.getElementById("pm_l").textContent = "M×" + res_p[2].toString();
                    document.getElementById("pl_l").textContent = "L×" + res_p[3].toString();
                }
                board_map_set()
                
                var vict = change_turn()
                ptype.textContent = "_"
                sel = false

                s = {
                        "xx": sel_x,
                        "yy": sel_y,
                        "x": x,
                        "y": y,
                        "size": sel_p,
                        "vict": vict,
                        "surrender": false
                    }
                send(s)
                if(vict)
                {
                    connection.close()
                }
                sel_x = -1
                sel_y = -1
                if(remove)
                {
                    pbtn[remove-1].checked = false
                    ptype.textContent = "_"
                    remove = 0
                    document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
                }
            }else if(board_st[y][x].top >= myturn){
                if(remove) //selected radio button
                {
                    pbtn[remove-1].checked = false
                    ptype.textContent = "_"
                    remove = 0
                    document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
                }

                sel_p = board_st[y][x].pop()
                document.getElementById(String(y) + String(x)).src = "image/P" + name_p[sel_p] + String(myturn) + "_sel.png";
                if(sel_x == -1)
                {
                    document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
                }else{
                    document.getElementById(String(sel_y) + String(sel_x)).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
                }
                switch(sel_p)
                {
                    case 1:
                        ptype.textContent = "S"
                        break;
                    case 2:
                        ptype.textContent = "M"
                        break;
                    case 3:
                        ptype.textContent = "L"
                }
                sel_x = x
                sel_y = y

            }
        }else{ // haven't selected
            /*if(remove) //selected radio button
            {
                sel = false
                pbtn[remove-1].checked = false
                ptype.textContent = "_"
                remove = 0
            }*/
            if (board_st[y][x].top >= myturn)
            {
                sel_p = board_st[y][x].pop()
                document.getElementById(String(y) + String(x)).src = "image/P" + name_p[sel_p] + String(myturn) + "_sel.png";
                switch(sel_p)
                {
                    case 1:
                        ptype.textContent = "S"
                        break;
                    case 2:
                        ptype.textContent = "M"
                        break;
                    case 3:
                        ptype.textContent = "L"
                }
                sel_x = x
                sel_y = y
                sel = true
            }
        }
    }            
}

// set click event of radio button
var remove = 0;
function radioDeselection(already, numeric)
{
    
    if(remove == numeric)
    {
        sel = false
        already.checked = false
        ptype.textContent = "_"
        document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
        remove = 0
    } else {
        if(sel) // selected field sel_p
        {
            sel = false
            
            if(sel_x > -1)
            {
                board_st[sel_y][sel_x].push(sel_p)
                document.getElementById(String(sel_y) + String(sel_x)).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
            }else{
                document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + ".png";
            }
        }
        

        if(res_p[numeric] > 0)
        {
            sel = true
            sel_p = numeric
            switch(sel_p)
            {
                case 1:
                    ptype.textContent = "S"
                    break;
                case 2:
                    ptype.textContent = "M"
                    break;
                case 3:
                    ptype.textContent = "L"
                    break;
            }
            document.getElementById("MyP" + name_p[sel_p]).src = "image/P" + name_p[sel_p] + String(myturn) + "_sel.png";
            sel_x = -1
            sel_y = -1
            remove = numeric
        }
    }
}
