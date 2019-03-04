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

function render(todoData) {
    // moment.locale('zh-tw');
    var $errorMsg = $("#errorMsg");
    var $addTodoInput = $("#addTodoInput");
    var HTML = "";
    var $ul = $("ul");
    for (var i = 0; i < todoData.length; i++) {
        HTML = HTML +
            `<li id="${todoData[i].id}"><button class="delete">刪除</button>
       ${todoData[i].content}
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
    // [2019-01-07]validate 接 newTodoData.content:newTodoText的值
    var isValid = validate(newTodoText);
    // 檢查是否合法 newTodoText
    if (isValid === false) {
        errorRender();
        return isValid;
    }
    var newTodoData = {
        id: uuid(),
        content: newTodoText,
        createdAt: moment().valueOf()
    };
    database.ref("tododata_Firebase").push(newTodoData).then(function () {
        todoData.push(newTodoData);
        render(todoData);
    }).catch(function () {
        alert("追加資料失敗");
    })
});

// 讀取tododata_Firebase的值
database.ref("tododata_Firebase").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        // var data = childSnapshot.val();
        // 並push到todoData陣列
        todoData.push({
            id: childSnapshot.val().id,
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
    var idToDelete = $(this).parents("li").attr("id");
    // alert(idToDelete);
    // 將匹配元素集合縮減為匹配選擇器或匹配函數返回值的新元素。
    todoData = todoData.filter(function (todo) {
        if (todo.id === idToDelete) return false;
        else return true;
    });
    render(todoData);

    // UUID & childsnapshot.key

    // database.ref("tododata_Firebase").once("value").then(function (snapshot) {
    //     snapshot.forEach(function (childsnapshot) {
    //         console.log(childsnapshot.key, childsnapshot.val())
    //     });
    // });

    // var li = document.getElementsByTagName("li");
    // for (var i = 0; i < li.length; i++) {
    //     li[i].addEventListener("click", function () {
    //         console.log("成功了才拿掉UI"+this.id);
    //         // then() 成功了才拿掉UI
    //         var id = this.id
    //         database.ref(`tododata_Firebase/${id}`).remove().then(function(){
    //             document.getElementById(id).remove();
    //             render(todoData);
    //         }).catch(function(){
    //             console.log("刪除失敗");
    //         })

    //     });
    // }
});

// function save() {
//     window.localStorage["content"] = document.getElementById("addTodoInput").value;
//     // localStorage.clear();
// }