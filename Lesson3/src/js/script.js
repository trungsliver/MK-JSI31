// File firebase-config.js
import { firebaseConfig } from "./firebase-config.js";
// Thư viện Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// Thư viện Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// Thư viện Firestore
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    addDoc,
	deleteDoc,
	onSnapshot,
	orderBy,
	serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);
// test app
console.log(app.name); // "[DEFAULT]"

// Khởi tạo dịch vụ Firestore
const db = getFirestore(app);
// Tham chiếu đến collection "note-list" trong Firestore
const notesRef = collection(db, "note-list");
// Lấy dữ liệu sắp xếp theo trường "createdAt" giảm dần
const notesQuery = query(notesRef, orderBy("createdAt", "desc"));

// Dùng DOM để lấy các thẻ HTML
const form = document.getElementById('note-form');
const input = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");
const emptyState = document.getElementById("empty-state");

// Sự kiện khi ấn nút "Thêm" (sử dụng bất đồng bộ - async await)
form.addEventListener("submit", async (e) => {
    // Ngăn việc form tự reload trang
    e.preventDefault();
    // Lấy nội dung người dùng viết trong ô input
    const text = input.value.trim();
    // Nếu input không có nội dung, không xử lý (thoát hàm)
    if (!text) return;
    // Nếu có nội dung, xử lý thêm note vào Firestore
    try {
        // Thêm phần tử mới (document) vào danh sách (collection) "note-list"
        await addDoc(notesRef, {
            text: text,
            createdAt: serverTimestamp() // Thời gian hiện tại
        })
        form.reset();
		input.focus();
    } catch (error) {
        console.error("Khong the them ghi chu:", error);
		alert("Them ghi chu that bai.");
    }
});


// Nếu dữ liệu firestore thay đổi => update giao diện HTML
onSnapshot(
	notesQuery,
	(snapshot) => {
		notesList.innerHTML = "";

        // Nếu không có ghi chú nào, hiển thị trạng thái rỗng
		if (snapshot.empty) {
			emptyState.style.display = "block";
			return;
		}

		emptyState.style.display = "none";

        // Duyệt qua từng document trong snapshot và tạo phần tử HTML tương ứng
		snapshot.forEach((item) => {
			const note = item.data();

			const li = document.createElement("li");
			li.className = "note-item";

			const textSpan = document.createElement("span");
			textSpan.textContent = note.text;

			const deleteBtn = document.createElement("button");
			deleteBtn.textContent = "Xóa";
			deleteBtn.type = "button";

            // Sự kiện khi ấn nút 'Xoa'
			deleteBtn.addEventListener("click", async () => {
				try {
					await deleteDoc(doc(db, "note-list", item.id));
				} catch (error) {
					console.error("Khong the xoa ghi chu:", error);
					alert("Xoa ghi chu that bai.");
				}
			});

			li.append(textSpan, deleteBtn);
			notesList.appendChild(li);
		});
	},
	(error) => {
		console.error("Khong the doc du lieu Firestore:", error);
		emptyState.style.display = "block";
		emptyState.textContent = "Khong doc duoc du lieu. Kiem tra Firestore Rules.";
	}
);
