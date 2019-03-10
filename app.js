var todoData = [];
var errorMsgData = "";

console.log(todoData);

// 檢查
function validate(newTodoText) {
    var isValid = true;
    if (newTodoText === "") {
        errorMsgData = "請輸入內容";
        isValid = false;

    }
    for (var i = 0; i < todoData.length; i++) {
        if (newTodoText === todoData[i].content) {
            errorMsgData = "重複輸入";
            isValid = false;
            $("#addTodoInput").val("");
        }
    }
    return isValid;
}

// 錯誤訊息
function errorRender() {
    $("#errorMsg").text(errorMsgData);
}

// 本地端陣列的TODODATA渲染到UI
function render(todoData) {
    // moment.locale('zh-tw');
    var $errorMsg = $("#errorMsg");
    var $addTodoInput = $("#addTodoInput");
    var HTML = "";
    var $ul = $("ul");
    for (var i = 0; i < todoData.length; i++) {
        HTML = HTML +
            `<li id="${todoData[i].id}">
            <button class="delete">刪除</button>
            <p>${todoData[i].content}</p>
            <span class="date-right">${moment(todoData[i].createdAt).format("MM/DD HH:mm")}</span>
        </li>`
    };
    $("ul").empty();
    $("#errorMsg").text("");
    $ul.append(HTML);
    $addTodoInput.val("");
    $errorMsg.text("");
}






$("#addTodoBtn").on("click", function () {
    // 阻止li消失的狀況，所以加上event.preventDefault();
    event.preventDefault();
    var $addTodoInput = $("#addTodoInput");
    // 修剪（）方法從字符串的兩側去除空格。
    var newTodoText = $addTodoInput.val().trim();
    moment.locale('zh-tw');
    // validate 接 newTodoData.content:newTodoText的值
    var isValid = validate(newTodoText);
    // 檢查是否合法 newTodoText
    if (isValid === false) {
        errorRender();
        return isValid;
    }
    var newTodoData = {
        // id: uuid(),
        // id: firbase的id,
        // id: "",
        content: newTodoText,
        createdAt: moment().valueOf()
    };
    database.ref("tododata_Firebase").push(newTodoData).then(function (snapshot) {
        // 補傳ID FIRBASE KEY 傳到 本地端的 NEWTODODATA ID
        newTodoData.id = snapshot.key;
        todoData.push(newTodoData);
        render(todoData);
    }).catch(function () {
        alert("追加資料失敗");
    })
});

// 讀 tododata_Firebase的值(抓新資料庫，最新資料同步)
database.ref("tododata_Firebase").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        // var data = childSnapshot.val();
        // 並push到todoData陣列
        todoData.push({
            // id: childSnapshot.val().id,
            id: childSnapshot.key,
            content: childSnapshot.val().content,
            createdAt: childSnapshot.val().createdAt
        });
    });
    // 再把todoData傳到render函數
    render(todoData);
}).catch(function () {
    alert("資料讀取失敗");
});

// 刪除按鈕 
$("ul").on("click", ".delete", function () {
    // $(this).parent("li").remove();
    // 先刪掉資料庫裡的資料
    // $(this) = .delete
    // $(".delete").parents("li").attr("id") = "-L_bJBfRLV0KXWesXAg2" 
    var idToDelete = $(this).parents("li").attr("id");
    // alert(idToDelete);
    // 先操作FIREBASE確定REMOVE後，THEN()再改變本地端的內容。
    database.ref(`tododata_Firebase/${idToDelete}`).remove().then(function () {
        // 將匹配元素集合縮減為匹配選擇器或匹配函數返回值的新元素。
        todoData = todoData.filter(function (todo) {
            console.log(todo.id);
            if (todo.id === idToDelete) return false;
            else return true;
        });
        render(todoData);
    }).catch(function () {
        alert("刪除不成功！");
    });
});

$("#todoList").on("click", "p", function () {
    console.log("click");
    var content = $(this).text();
    console.log(content);
    var $li = $(this).parent()
    $li.children("p").remove();
    $li.children("button").after(`<input type="text" value="${content}">`)
});


$("#todoList").on("keypress", "input", function (e) {
    if (e.keyCode !== 13) {
        return;
    }
    var content = $(this).val();
    // console.log(content);
    var id = $(this).parent().attr("id");
    var updateTodo = {
        content: content,
        createdAt: moment().valueOf()
    }
    database.ref(`tododata_Firebase/${id}`).update(updateTodo).then(function (snapshot) {
        updateTodo.id = id;
        todoData = todoData.map(function (current) {
            if (current.id == id) {
                return {
                    id: current.id,
                    content: updateTodo.content,
                    createdAt: updateTodo.createdAt
                }
            } else {
                return current
            }
        })
        render(todoData);
    })
})
//　Q.1 
// 上傳到TODODATA FIREBASE UPDATE還是不太理解。

//　Q.2
// 想做點選P時，不想重複選到INPUT
// 想做不允許再INPUT框輸入空白

//　Q.3
// 改變DELETE按鈕的位置後，發現因為這行的關係，所以無法更動原有的UI
// $li.children("button").after(`<input type="text" value="${content}">`);
// 寫成這樣後，沒辦法顯示出INPUT
// $li.children("date-right").before(`<input type="text" value="${content}">`)
// 01. <p>${todoData[i].content}</p>
// 02. <span class="date-right">${moment(todoData[i].createdAt).format("MM/DD HH:mm")}</span>
// 03. <button class="delete">刪除</button>