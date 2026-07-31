// Khởi tạo firebase và cấu hình auth
let auth;
try {
    // Dung compat SDK de dong bo voi firebase.auth() ben duoi
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    auth = firebase.auth();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    console.log("Firebase persistence set to LOCAL");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

if (firebase.apps.length) {
    console.log(firebase.app().name); // "[DEFAULT]"
}

// Lấy các phần tử DOM từ HTML để thao tác
const loginForm = document.getElementById('login'); // Form đăng nhập
const registerForm = document.getElementById('register'); // Form đăng ký
const loginFormContainer = document.getElementById('loginForm'); // Container chứa form đăng nhập
const registerFormContainer = document.getElementById('registerForm'); // Container chứa form đăng ký
const userInfo = document.getElementById('userInfo'); // Phần hiển thị thông tin người dùng
const userEmail = document.getElementById('userEmail'); // Phần hiển thị email người dùng
const logoutBtn = document.getElementById('logoutBtn'); // Nút đăng xuất
const showRegisterLink = document.getElementById('showRegister'); // Link chuyển đến form đăng ký
const showLoginLink = document.getElementById('showLogin'); // Link chuyển đến form đăng nhập
const googleLoginBtn = document.getElementById('googleLoginBtn'); // Nút đăng nhập Google

// Xử lý chuyển đổi giữa form đăng nhập và đăng ký
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của link
    loginFormContainer.style.display = 'none'; // Ẩn form đăng nhập
    registerFormContainer.style.display = 'block'; // Hiển thị form đăng ký
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của link
    registerFormContainer.style.display = 'none'; // Ẩn form đăng ký
    loginFormContainer.style.display = 'block'; // Hiển thị form đăng nhập
});

// Xử lý đăng ký tài khoản mới
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const email = document.getElementById('registerEmail').value; // Lấy giá trị email từ form
    const password = document.getElementById('registerPassword').value; // Lấy giá trị mật khẩu từ form

    // Kiểm tra độ dài mật khẩu (tối thiểu 6 ký tự)
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    // Nếu muốn nâng cao, tìm kiếm từ khóa regular expression

    if (!auth) {
        alert('Firebase chưa khởi tạo xong, vui lòng thử lại.');
        return;
    }

    try {
        // Tạo tài khoản mới thông qua Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('User registered successfully:', userCredential.user.email);
        registerForm.reset(); // Reset form sau khi đăng ký thành công
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message); // Hiển thị thông báo lỗi cho người dùng
    }
});

// Xử lý đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const email = document.getElementById('loginEmail').value; // Lấy giá trị email từ form
    const password = document.getElementById('loginPassword').value; // Lấy giá trị mật khẩu từ form

    if (!auth) {
        alert('Firebase chưa khởi tạo xong, vui lòng thử lại.');
        return;
    }

    try {
        // Đăng nhập thông qua Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('User logged in successfully:', userCredential.user.email);
        loginForm.reset(); // Reset form sau khi đăng nhập thành công
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message); // Hiển thị thông báo lỗi cho người dùng
    }
});

// Xử lý đăng nhập bằng Google
googleLoginBtn.addEventListener('click', async () => {
    if (!auth) {
        alert('Firebase chưa khởi tạo xong, vui lòng thử lại.');
        return;
    }

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await auth.signInWithPopup(provider);
        console.log('Google login success:', userCredential.user.email);
    } catch (error) {
        console.error('Google login error:', error);
        alert(error.message);
    }
});

// Xử lý đăng xuất
logoutBtn.addEventListener('click', async () => {
    if (!auth) {
        alert('Firebase chưa khởi tạo xong, vui lòng thử lại.');
        return;
    }

    try {
        await auth.signOut(); // Đăng xuất khỏi Firebase
        console.log('User logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        alert(error.message); // Hiển thị thông báo lỗi cho người dùng
    }
});

// Theo dõi trạng thái đăng nhập của người dùng
if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Người dùng đã đăng nhập
            console.log('User is signed in:', user.email);
            loginFormContainer.style.display = 'none'; // Ẩn form đăng nhập
            registerFormContainer.style.display = 'none'; // Ẩn form đăng ký
            userInfo.style.display = 'block'; // Hiển thị thông tin người dùng
            userEmail.textContent = user.email; // Hiển thị email người dùng
        } else {
            // Người dùng đã đăng xuất
            console.log('User is signed out');
            loginFormContainer.style.display = 'block'; // Hiển thị form đăng nhập
            registerFormContainer.style.display = 'none'; // Ẩn form đăng ký
            userInfo.style.display = 'none'; // Ẩn thông tin người dùng
        }
    });
}