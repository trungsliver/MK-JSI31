// File firebase-config.js
import { firebaseConfig } from "./firebase-config.js";
// Thư viện Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
// Thư viện Authentication
import {
    getAuth,
    onAuthStateChanged,
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


// Khởi tạo Firebase với cấu hình từ file firebase-config.js
const app = initializeApp(firebaseConfig);
// Khởi tạo Authentication service
const auth = getAuth(app);
// Khởi tạo Firestore service
const db = getFirestore(app);

// Cấu hình Cloudinary - dịch vụ lưu trữ hình ảnh
const CLOUDINARY_CLOUD_NAME = "dxhn2bknj";
const CLOUDINARY_UPLOAD_PRESET = "mk-jsi31";

// Đợi cho DOM được tải hoàn toàn trước khi thực thi code
document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM cần thiết
    const authContainer = document.getElementById('auth-container'); // Container chứa form đăng nhập/đăng ký
    const appContainer = document.getElementById('app-container'); // Container chính của ứng dụng
    const loginForm = document.getElementById('login'); // Form đăng nhập
    const registerForm = document.getElementById('register'); // Form đăng ký
    const loginFormContainer = document.getElementById('loginForm'); // Container form đăng nhập
    const registerFormContainer = document.getElementById('registerForm'); // Container form đăng ký
    const showRegisterLink = document.getElementById('showRegister'); // Link chuyển sang form đăng ký
    const showLoginLink = document.getElementById('showLogin'); // Link chuyển sang form đăng nhập
    const userSection = document.getElementById('user-section'); // Phần hiển thị thông tin người dùng
    const userEmailSpan = document.getElementById('user-email'); // Hiển thị email người dùng
    const logoutButton = document.getElementById('logout-button'); // Nút đăng xuất
    const postForm = document.getElementById('post-form'); // Form đăng bài
    const imageInput = document.getElementById('image-input'); // Input chọn ảnh
    const captionInput = document.getElementById('caption-input'); // Input nhập caption
    const submitPostButton = document.getElementById('submit-post-button'); // Nút đăng bài
    const loadingIndicator = document.getElementById('loading-indicator'); // Hiển thị trạng thái loading
    const feedContainer = document.getElementById('feed-container'); // Container hiển thị các bài đăng

    // Xử lý chuyển đổi giữa form đăng nhập và đăng ký
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }

    // Xử lý đăng ký tài khoản mới
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Kiểm tra độ dài mật khẩu
            if (password.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự');
                return;
            }

            try {
                // Tạo tài khoản mới với email và mật khẩu
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('User registered successfully:', userCredential.user.email);
                registerForm.reset();
                // Chuyển về form đăng nhập sau khi đăng ký thành công
                registerFormContainer.style.display = 'none';
                loginFormContainer.style.display = 'block';
            } catch (error) {
                console.error('Registration error:', error);
                alert(getAuthErrorMessage(error));
            }
        });
    }

    // Xử lý đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // Đăng nhập với email và mật khẩu
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('User logged in successfully:', userCredential.user.email);
                loginForm.reset();
            } catch (error) {
                console.error('Login error:', error);
                alert(getAuthErrorMessage(error));
            }
        });
    }

    // Xử lý đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log('User logged out successfully');
            } catch (error) {
                console.error('Logout error:', error);
                alert(error.message);
            }
        });
    }

    // Xử lý đăng bài mới
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Lấy người dùng hiện tại
            const user = auth.currentUser;
            // Lấy ảnh đầu tiên từ form
            const file = imageInput.files[0];
            // Lấy caption từ form
            const caption = captionInput.value;

            // Kiểm tra đầy đủ thông tin
            if (!user || !file || !caption.trim()) {
                alert("Vui lòng điền đầy đủ thông tin và chọn ảnh.");
                return;
            }

            // Vô hiệu hóa form và hiển thị loading
            submitPostButton.disabled = true;
            loadingIndicator.classList.remove('hidden');

            try {
                // Bước 1: Upload ảnh lên Cloudinary
                const imageUrl = await uploadImageToCloudinary(file);
                
                // Bước 2: Lưu thông tin bài đăng vào Firestore
                await addDoc(collection(db, "posts"), {
                    caption: caption,
                    imageUrl: imageUrl,
                    authorEmail: user.email,
                    authorId: user.uid,
                    createdAt: serverTimestamp()
                });
                
                // Reset form sau khi đăng thành công
                postForm.reset();

            } catch (error) {
                console.error("Lỗi đăng bài:", error);
                alert("Đã có lỗi xảy ra khi đăng bài. Vui lòng thử lại.");
            } finally {
                // Kích hoạt lại form và ẩn loading
                submitPostButton.disabled = false;
                loadingIndicator.classList.add('hidden');
            }
        });
    }
});

// Theo dõi trạng thái đăng nhập của người dùng
onAuthStateChanged(auth, (user) => {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const userSection = document.getElementById('user-section');
    const userEmailSpan = document.getElementById('user-email');
    const feedContainer = document.getElementById('feed-container');

    if (user) {
        // Người dùng đã đăng nhập
        console.log('User is signed in:', user.email);
        if (authContainer) authContainer.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        if (userSection) userSection.classList.remove('hidden');
        if (userEmailSpan) userEmailSpan.textContent = user.email;
        listenToPosts(); // Bắt đầu lắng nghe các bài đăng mới
    } else {
        // Người dùng chưa đăng nhập
        console.log('User is signed out');
        if (authContainer) authContainer.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        if (userSection) userSection.classList.add('hidden');
        if (feedContainer) feedContainer.innerHTML = '<h2>Vui lòng đăng nhập để xem bảng tin</h2>';
    }
});

// Hàm xử lý và hiển thị thông báo lỗi xác thực
function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-login-credentials':
            return 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
        case 'auth/email-already-in-use':
            return 'Email này đã được sử dụng. Vui lòng sử dụng email khác.';
        case 'auth/weak-password':
            return 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.';
        case 'auth/invalid-email':
            return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
        default:
            return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    }
}

// Hàm upload ảnh lên Cloudinary
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    // Gửi request upload ảnh
    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url; // Trả về URL của ảnh đã upload
}

// Hàm lắng nghe và hiển thị các bài đăng theo thời gian thực
function listenToPosts() {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    // Tạo query để lấy bài đăng theo thứ tự thời gian mới nhất
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    // Lắng nghe thay đổi từ Firestore
    onSnapshot(postsQuery, (snapshot) => {
        feedContainer.innerHTML = ''; // Xóa các bài đăng cũ
        
        // Hiển thị từng bài đăng
        snapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <img src="${post.imageUrl}" alt="Post image">
                <p class="caption">${post.caption}</p>
                <p class="author">Đăng bởi: ${post.authorEmail}</p>
                <p class="timestamp">${post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString() : 'Vừa xong'}</p>
            `;
            feedContainer.appendChild(postElement);
        });
    }, (error) => {
        console.error("Error listening to posts:", error);
        feedContainer.innerHTML = '<p>Lỗi khi tải bài đăng. Vui lòng thử lại sau.</p>';
    });
}
