// Bài 1: Darkmode / Lightmode
    // Dùng DOM lấy button
const toggleButton = document.getElementById("themeBtn");
    // Xử lý sự kiện ấn nút
toggleButton.onclick = () => {
    // Thêm hoặc xóa class "darkmode" cho thẻ body
    document.body.classList.toggle("darkmode");
    // Lưu trạng thái hiện tại vào localStorage
    if (document.body.classList.contains("darkmode")) {
        // key: "theme", value: "darkmode"
        localStorage.setItem("theme", "darkmode");
    } else {
        // key: "theme", value: "lightmode"
        localStorage.setItem("theme", "lightmode");
    }
}

// Load theme từ localStorage khi reload trang
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "darkmode") {
    // thêm class "darkmode" cho thẻ body
    document.body.classList.add("darkmode");
}

// Bài 2: Note List
    // Lấy danh sách ghi chú từ localStorage hoặc tạo mới ds rỗng
let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // hàm hiển thị danh sách ghi chú
function displayNotes() {
    // Lấy container hiển thị ghi chú
    const container = document.getElementById("noteList");
    // Xóa nội dung cũ
    container.innerHTML = "";
    // Duyệt danh sách và tạp phần tử HTML cho từng ghi chú
    notes.forEach((note, index) => {
        // Tạo thẻ li cho mỗi note
        const li = document.createElement("li");
        li.textContent = note;
        // Thêm vào container
        container.appendChild(li);
    });
}
displayNotes();

    // Sự kiện ấn nút thêm ghi chú
const addButton = document.getElementById("addNote");
addButton.onclick = () => {
    // Lấy dữ liệu từ input
    const content = document.getElementById("noteInput").value.trim();
    if (content) {
        // Thêm ghi chú vào danh sách
        notes.push(content);
        // Lưu danh sách vào localStorage
        localStorage.setItem("notes", JSON.stringify(notes));
        // Hiển thị lại danh sách
        displayNotes();
        // Xóa input sau khi thêm
        document.getElementById("noteInput").value = "";
    }
}