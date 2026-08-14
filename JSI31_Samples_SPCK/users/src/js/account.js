/* =========================================================
   FIREBASE IMPORT
========================================================= */
import {
    firebaseConfig
} from "./firebase-config.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loginSection =
    document.getElementById("login-section");

const registerSection =
    document.getElementById("register-section");

const profileSection =
    document.getElementById("profile-section");


const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");


const loginBtn =
    document.getElementById("login-btn");

const registerBtn =
    document.getElementById("register-btn");

const googleLoginBtn =
    document.getElementById("google-login-btn");

const logoutBtn =
    document.getElementById("logout-btn");


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const CURRENT_USER_KEY = "current_user";

const CURRENT_USERS_KEY = "current_users";

const USERS_KEY = "users";


/* =========================================================
   VALIDATION REGEX
========================================================= */

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/*
    Số điện thoại Việt Nam:

    03xxxxxxxx
    05xxxxxxxx
    07xxxxxxxx
    08xxxxxxxx
    09xxxxxxxx

    Cho phép dạng:
    0912345678
    +84912345678
*/

const phoneRegex =
    /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;


/*
    Password:

    - Ít nhất 6 ký tự
    - Có chữ hoa
    - Có chữ thường
    - Có số
*/

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;


/* =========================================================
   SECTION SWITCH
========================================================= */

function showSection(sectionId) {

    const sections = [
        loginSection,
        registerSection,
        profileSection
    ];

    sections.forEach(section => {

        if (!section) {
            return;
        }

        section.classList.add("d-none");

    });


    const target =
        document.getElementById(sectionId);

    if (!target) {
        return;
    }

    target.classList.remove("d-none");

    target.style.animation = "none";

    target.offsetHeight;

    target.style.animation =
        "sectionShow 0.35s ease";

}


/* =========================================================
   SWITCH BUTTON
========================================================= */

document
    .querySelectorAll("[data-target-section]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                button.dataset.targetSection;

            clearAllMessages();

            showSection(target);

        });

    });


/* =========================================================
   MESSAGE
========================================================= */

function setMessage(elementId, message, type = "") {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        "account-message";

    if (type) {
        element.classList.add(type);
    }

}


function clearAllMessages() {

    setMessage(
        "login-message",
        ""
    );

    setMessage(
        "register-message",
        ""
    );

    document
        .querySelectorAll(".field-error")
        .forEach(element => {

            element.textContent = "";

        });

}


/* =========================================================
   FIELD ERROR
========================================================= */

function setFieldError(
    elementId,
    message
) {

    const element =
        document.getElementById(elementId);

    if (element) {

        element.textContent =
            message;

    }

}


/* =========================================================
   CLEAR REGISTER ERRORS
========================================================= */

function clearRegisterErrors() {

    const ids = [

        "register-username-error",

        "register-email-error",

        "register-phone-error",

        "register-dob-error",

        "register-password-error",

        "register-confirm-password-error",

        "register-terms-error"

    ];

    ids.forEach(id => {

        setFieldError(id, "");

    });

}


/* =========================================================
   CLEAR LOGIN ERRORS
========================================================= */

function clearLoginErrors() {

    setFieldError(
        "login-email-error",
        ""
    );

    setFieldError(
        "login-password-error",
        ""
    );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.target;

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }


            const icon =
                button.querySelector("i");


            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove(
                    "bi-eye"
                );

                icon.classList.add(
                    "bi-eye-slash"
                );

            } else {

                input.type = "password";

                icon.classList.remove(
                    "bi-eye-slash"
                );

                icon.classList.add(
                    "bi-eye"
                );

            }

        });

    });


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(
    button,
    loading,
    loadingText = "Đang xử lý..."
) {

    if (!button) {
        return;
    }

    const text =
        button.querySelector(".btn-text");

    const loadingElement =
        button.querySelector(".btn-loading");


    button.disabled = loading;


    if (text) {

        text.classList.toggle(
            "d-none",
            loading
        );

    }


    if (loadingElement) {

        loadingElement.classList.toggle(
            "d-none",
            !loading
        );

        const textNode =
            loadingElement.childNodes[
                loadingElement.childNodes.length - 1
            ];

        if (
            textNode &&
            textNode.nodeType === Node.TEXT_NODE
        ) {

            textNode.textContent =
                ` ${loadingText}`;

        }

    }

}


/* =========================================================
   AGE VALIDATION
========================================================= */

function calculateAge(dateOfBirth) {

    const birthDate =
        new Date(dateOfBirth);

    const today =
        new Date();


    let age =
        today.getFullYear()
        - birthDate.getFullYear();


    const monthDifference =
        today.getMonth()
        - birthDate.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

}


/* =========================================================
   VALIDATE DOB
========================================================= */

function validateDOB(dob) {

    if (!dob) {

        return {
            valid: false,
            message: "Vui lòng chọn ngày sinh."
        };

    }


    const birthDate =
        new Date(dob);

    const today =
        new Date();


    if (birthDate > today) {

        return {
            valid: false,
            message: "Ngày sinh không hợp lệ."
        };

    }


    const age =
        calculateAge(dob);


    if (age < 13) {

        return {
            valid: false,
            message:
                "Bạn phải đủ 13 tuổi để đăng ký."
        };

    }


    return {
        valid: true,
        message: ""
    };

}


/* =========================================================
   CHECK USERNAME EXIST
========================================================= */

async function isUsernameExists(username) {

    const usersRef =
        collection(db, "users");


    const usernameQuery =
        query(
            usersRef,
            where(
                "username",
                "==",
                username
            )
        );


    const snapshot =
        await getDocs(usernameQuery);


    return !snapshot.empty;

}


/* =========================================================
   CHECK EMAIL EXIST IN FIRESTORE
========================================================= */

async function isEmailExists(email) {

    const usersRef =
        collection(db, "users");


    const emailQuery =
        query(
            usersRef,
            where(
                "email",
                "==",
                email
            )
        );


    const snapshot =
        await getDocs(emailQuery);


    return !snapshot.empty;

}


/* =========================================================
   UPDATE LOCAL USERS
========================================================= */

function saveUserToLocalUsers(userData) {

    let users = [];

    try {

        users =
            JSON.parse(
                localStorage.getItem(
                    USERS_KEY
                )
            ) || [];

    } catch (error) {

        users = [];

    }


    const existingIndex =
        users.findIndex(
            user =>
                user.uid === userData.uid ||
                user.email === userData.email
        );


    if (existingIndex !== -1) {

        users[existingIndex] = {
            ...users[existingIndex],
            ...userData
        };

    } else {

        users.push(userData);

    }


    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =========================================================
   SAVE CURRENT USER
========================================================= */

function saveCurrentUser(userData) {

    const data = {
        ...userData
    };


    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(data)
    );


    /*
        Giữ thêm current_users để tương thích
        với cấu trúc localStorage yêu cầu.
    */

    localStorage.setItem(
        CURRENT_USERS_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   GET CURRENT USER LOCAL
========================================================= */

function getCurrentUserLocal() {

    try {

        const data =
            localStorage.getItem(
                CURRENT_USER_KEY
            );

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Cannot read current user:",
            error
        );

        return null;

    }

}


/* =========================================================
   REGISTER
========================================================= */

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        clearRegisterErrors();

        setMessage(
            "register-message",
            ""
        );


        /* =========================
           GET VALUES
        ========================== */

        const username =
            document
                .getElementById(
                    "register-username"
                )
                .value
                .trim();

        const email =
            document
                .getElementById(
                    "register-email"
                )
                .value
                .trim()
                .toLowerCase();

        const phone =
            document
                .getElementById(
                    "register-phone"
                )
                .value
                .trim();

        const dob =
            document
                .getElementById(
                    "register-dob"
                )
                .value;

        const password =
            document
                .getElementById(
                    "register-password"
                )
                .value;

        const confirmPassword =
            document
                .getElementById(
                    "register-confirm-password"
                )
                .value;

        const terms =
            document
                .getElementById(
                    "register-terms"
                )
                .checked;


        /* =========================
           VALIDATION
        ========================== */

        let isValid = true;


        /* Username */

        if (username.length < 3) {

            setFieldError(
                "register-username-error",
                "Username phải có ít nhất 3 ký tự."
            );

            isValid = false;

        }


        /* Email */

        if (!emailRegex.test(email)) {

            setFieldError(
                "register-email-error",
                "Email không đúng định dạng."
            );

            isValid = false;

        }


        /* Phone */

        const normalizedPhone =
            phone.startsWith("+84")
                ? "0" + phone.substring(3)
                : phone;


        if (
            !phoneRegex.test(phone) &&
            !phoneRegex.test(normalizedPhone)
        ) {

            setFieldError(
                "register-phone-error",
                "Số điện thoại Việt Nam không hợp lệ."
            );

            isValid = false;

        }


        /* DOB */

        const dobResult =
            validateDOB(dob);


        if (!dobResult.valid) {

            setFieldError(
                "register-dob-error",
                dobResult.message
            );

            isValid = false;

        }


        /* Password */

        if (!passwordRegex.test(password)) {

            setFieldError(
                "register-password-error",
                "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số."
            );

            isValid = false;

        }


        /* Confirm password */

        if (password !== confirmPassword) {

            setFieldError(
                "register-confirm-password-error",
                "Mật khẩu xác nhận không khớp."
            );

            isValid = false;

        }


        /* Terms */

        if (!terms) {

            setFieldError(
                "register-terms-error",
                "Bạn cần đồng ý với Terms and Conditions."
            );

            isValid = false;

        }


        if (!isValid) {

            setMessage(
                "register-message",
                "Vui lòng kiểm tra lại thông tin.",
                "error"
            );

            return;

        }


        /* =========================
           START LOADING
        ========================== */

        setButtonLoading(
            registerBtn,
            true,
            "Đang đăng ký..."
        );


        try {

            /* =========================
               CHECK USERNAME
            ========================== */

            const usernameExists =
                await isUsernameExists(
                    username
                );


            if (usernameExists) {

                setFieldError(
                    "register-username-error",
                    "Username này đã được sử dụng."
                );

                setMessage(
                    "register-message",
                    "Đăng ký thất bại. Username đã tồn tại.",
                    "error"
                );

                return;

            }


            /* =========================
               CHECK EMAIL
            ========================== */

            const emailExists =
                await isEmailExists(email);


            if (emailExists) {

                setFieldError(
                    "register-email-error",
                    "Email này đã được đăng ký."
                );

                setMessage(
                    "register-message",
                    "Email đã tồn tại trong hệ thống.",
                    "error"
                );

                return;

            }


            /* =========================
               FIREBASE AUTH
            ========================== */

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /* =========================
               UPDATE DISPLAY NAME
            ========================== */

            await updateProfile(
                user,
                {
                    displayName: username
                }
            );


            /* =========================
               USER DATA
            ========================== */

            const userData = {

                uid: user.uid,

                username: username,

                email: email,

                phone: normalizedPhone,

                dob: dob,

                provider: "password",

                created_at:
                    new Date().toISOString(),

                last_login: null

            };


            /* =========================
               FIRESTORE
            ========================== */

            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {
                    ...userData,

                    created_at:
                        serverTimestamp()
                }
            );


            /* =========================
               LOCAL STORAGE USERS
            ========================== */

            saveUserToLocalUsers(
                userData
            );


            setMessage(
                "register-message",
                "Đăng ký thành công! Đang chuyển sang đăng nhập...",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                showSection(
                    "login-section"
                );

                setMessage(
                    "login-message",
                    "Đăng ký thành công. Hãy đăng nhập để tiếp tục.",
                    "success"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Register error:",
                error
            );


            let message =
                "Đăng ký thất bại. Vui lòng thử lại.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "Email này đã được đăng ký.";

                setFieldError(
                    "register-email-error",
                    message
                );

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Email không hợp lệ.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Mật khẩu quá yếu.";

            }


            setMessage(
                "register-message",
                message,
                "error"
            );

        } finally {

            setButtonLoading(
                registerBtn,
                false
            );

        }

    }
);


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        clearLoginErrors();

        setMessage(
            "login-message",
            ""
        );


        const email =
            document
                .getElementById(
                    "login-email"
                )
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById(
                    "login-password"
                )
                .value;


        let isValid = true;


        /* Email */

        if (!emailRegex.test(email)) {

            setFieldError(
                "login-email-error",
                "Email không đúng định dạng."
            );

            isValid = false;

        }


        /* Password */

        if (!passwordRegex.test(password)) {

            setFieldError(
                "login-password-error",
                "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số."
            );

            isValid = false;

        }


        if (!isValid) {

            setMessage(
                "login-message",
                "Vui lòng kiểm tra lại thông tin.",
                "error"
            );

            return;

        }


        setButtonLoading(
            loginBtn,
            true,
            "Đang đăng nhập..."
        );


        try {

            /* =========================
               FIREBASE AUTH LOGIN
            ========================== */

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            const loginTime =
                new Date().toISOString();


            /* =========================
               GET FIRESTORE PROFILE
            ========================== */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            let userData = {

                uid: user.uid,

                username:
                    user.displayName ||
                    email.split("@")[0],

                email:
                    user.email,

                phone: "",

                dob: "",

                provider: "password",

                last_login:
                    loginTime

            };


            if (userSnapshot.exists()) {

                const firestoreData =
                    userSnapshot.data();


                userData = {

                    ...userData,

                    ...firestoreData,

                    uid: user.uid,

                    email: user.email,

                    last_login:
                        loginTime

                };

            }


            /* =========================
               UPDATE LAST LOGIN
            ========================== */

            await setDoc(
                userRef,
                {
                    last_login:
                        serverTimestamp()
                },
                {
                    merge: true
                }
            );


            /* =========================
               LOCAL STORAGE
            ========================== */

            saveCurrentUser(
                userData
            );

            saveUserToLocalUsers(
                userData
            );


            setMessage(
                "login-message",
                "Đăng nhập thành công!",
                "success"
            );


            setTimeout(() => {

                showProfile(
                    userData
                );

            }, 500);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            let message =
                "Email hoặc mật khẩu không chính xác.";


            if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "Email chưa được đăng ký.";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "Mật khẩu không chính xác.";

            }

            else if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Email hoặc mật khẩu không chính xác.";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                message =
                    "Có quá nhiều lần thử. Vui lòng thử lại sau.";

            }


            setMessage(
                "login-message",
                message,
                "error"
            );

        } finally {

            setButtonLoading(
                loginBtn,
                false
            );

        }

    }
);


/* =========================================================
   GOOGLE LOGIN
========================================================= */

googleLoginBtn.addEventListener(
    "click",
    async () => {

        googleLoginBtn.disabled = true;


        try {

            const result =
                await signInWithPopup(
                    auth,
                    googleProvider
                );


            const user =
                result.user;


            const loginTime =
                new Date().toISOString();


            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            let userData;


            if (userSnapshot.exists()) {

                userData = {

                    ...userSnapshot.data(),

                    uid: user.uid,

                    username:
                        userSnapshot.data().username ||
                        user.displayName ||
                        user.email.split("@")[0],

                    email:
                        user.email,

                    last_login:
                        loginTime,

                    provider: "google"

                };

            } else {

                /*
                    Google account chưa có dữ liệu
                    username/phone/dob.
                */

                userData = {

                    uid: user.uid,

                    username:
                        user.displayName ||
                        user.email.split("@")[0],

                    email:
                        user.email,

                    phone: "",

                    dob: "",

                    provider: "google",

                    created_at:
                        new Date().toISOString(),

                    last_login:
                        loginTime

                };

            }


            /* =========================
               SAVE FIRESTORE
            ========================== */

            await setDoc(
                userRef,
                {
                    ...userData,

                    last_login:
                        serverTimestamp()
                },
                {
                    merge: true
                }
            );


            /* =========================
               LOCAL STORAGE
            ========================== */

            saveCurrentUser(
                userData
            );

            saveUserToLocalUsers(
                userData
            );


            showProfile(
                userData
            );


        } catch (error) {

            console.error(
                "Google login error:",
                error
            );


            if (
                error.code !==
                "auth/popup-closed-by-user"
            ) {

                setMessage(
                    "login-message",
                    "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
                    "error"
                );

            }

        } finally {

            googleLoginBtn.disabled = false;

        }

    }
);


/* =========================================================
   SHOW PROFILE
========================================================= */

function showProfile(userData) {

    if (!userData) {
        return;
    }


    showSection(
        "profile-section"
    );


    const username =
        userData.username ||
        userData.displayName ||
        "User";


    /* Avatar */

    const avatarText =
        username
            .charAt(0)
            .toUpperCase();


    document
        .getElementById(
            "profile-avatar-text"
        )
        .textContent =
        avatarText;


    /* Welcome */

    document
        .getElementById(
            "profile-welcome"
        )
        .textContent =
        `Xin chào, ${username}!`;


    /* Username */

    document
        .getElementById(
            "profile-username"
        )
        .textContent =
        username;


    /* Email */

    document
        .getElementById(
            "profile-email"
        )
        .textContent =
        userData.email || "-";


    /* Phone */

    document
        .getElementById(
            "profile-phone"
        )
        .textContent =
        userData.phone || "Chưa cập nhật";


    /* DOB */

    document
        .getElementById(
            "profile-dob"
        )
        .textContent =
        formatDate(
            userData.dob
        );


    /* Last login */

    document
        .getElementById(
            "profile-last-login"
        )
        .textContent =
        formatDateTime(
            userData.last_login
        );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Chưa cập nhật";
    }


    /*
        Nếu Firestore Timestamp
    */

    if (
        typeof dateValue.toDate ===
        "function"
    ) {

        dateValue =
            dateValue.toDate();

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Chưa cập nhật";

    }


    return date.toLocaleDateString(
        "vi-VN"
    );

}


/* =========================================================
   FORMAT DATE TIME
========================================================= */

function formatDateTime(dateValue) {

    if (!dateValue) {
        return "Chưa đăng nhập";
    }


    /*
        Firestore Timestamp
    */

    if (
        typeof dateValue.toDate ===
        "function"
    ) {

        dateValue =
            dateValue.toDate();

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Chưa đăng nhập";

    }


    return date.toLocaleString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        logoutBtn.disabled = true;


        try {

            await signOut(auth);


            localStorage.removeItem(
                CURRENT_USER_KEY
            );

            localStorage.removeItem(
                CURRENT_USERS_KEY
            );


            clearAllMessages();


            loginForm.reset();


            showSection(
                "login-section"
            );


            setMessage(
                "login-message",
                "Bạn đã đăng xuất thành công.",
                "success"
            );


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );


            setMessage(
                "login-message",
                "Không thể đăng xuất. Vui lòng thử lại.",
                "error"
            );

        } finally {

            logoutBtn.disabled = false;

        }

    }
);


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        /*
            Khi Firebase xác định có user
        */

        if (user) {

            try {

                const userRef =
                    doc(
                        db,
                        "users",
                        user.uid
                    );


                const snapshot =
                    await getDoc(userRef);


                let currentUser =
                    getCurrentUserLocal();


                /*
                    Nếu localStorage đã có
                    và đúng UID
                */

                if (
                    currentUser &&
                    currentUser.uid === user.uid
                ) {

                    showProfile(
                        currentUser
                    );

                    return;

                }


                /*
                    Nếu chưa có localStorage,
                    lấy từ Firestore.
                */

                if (snapshot.exists()) {

                    const data =
                        snapshot.data();


                    currentUser = {

                        ...data,

                        uid: user.uid,

                        username:
                            data.username ||
                            user.displayName ||
                            user.email.split("@")[0],

                        email:
                            user.email

                    };

                } else {

                    currentUser = {

                        uid: user.uid,

                        username:
                            user.displayName ||
                            user.email.split("@")[0],

                        email:
                            user.email,

                        phone: "",

                        dob: "",

                        provider:
                            user.providerData?.[0]
                                ?.providerId ||
                            "password",

                        last_login: null

                    };

                }


                saveCurrentUser(
                    currentUser
                );

                saveUserToLocalUsers(
                    currentUser
                );


                showProfile(
                    currentUser
                );


            } catch (error) {

                console.error(
                    "Auth state error:",
                    error
                );

                showSection(
                    "login-section"
                );

            }

        }

        /*
            Không có Firebase user
        */

        else {

            localStorage.removeItem(
                CURRENT_USER_KEY
            );

            localStorage.removeItem(
                CURRENT_USERS_KEY
            );


            showSection(
                "login-section"
            );

        }

    }
);


/* =========================================================
   CHECK LOCAL STORAGE ON PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
            Firebase onAuthStateChanged
            sẽ tiếp tục xác nhận trạng thái.
        */

        const currentUser =
            getCurrentUserLocal();


        if (currentUser) {

            showProfile(
                currentUser
            );

        } else {

            showSection(
                "login-section"
            );

        }

    }
);