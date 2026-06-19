// Bài 1: Lấy dữ liệu từ file js
    // Khai báo danh sách dữ liệu
const students = [
    {id: 1, name: 'Quang Huy'},
    {id: 2, name: 'Minh Nhật'},
    {id: 3, name: 'Xuân Tú'},
    {id: 4, name: 'Bảo Lâm'},
    {id: 5, name: 'Gia Bảo'},
    {id: 6, name: 'Khải Hoàng'},
    {id: 7, name: 'Đình Hải'}
]

    // Hàm hiển thị dữ liệu
function displayStudents() {
    // Dùng DOM để lấy container (thẻ div chứa học sinh)
    const container = document.getElementById('studentList')
    // Duyệt danh sách students (file js)
    students.forEach(student => {
        // Tạo thẻ p cho mỗi học sinh
        const p = document.createElement('p');
        // Gán thông tin học inh vào thẻ li
        p.textContent = `ID: ${student.id}, Tên: ${student.name}`;
        // Thêm thẻ li vào container
        container.appendChild(p);
    })
}
displayStudents()

// Bài 2: Hiển thị dữ liệu từ file json
    // Lấy dữ liệu từ file data.json bằng fetch API
fetch('./data.json')
    // Chuyển đổi dữ liệu lấy về (response) thành định dạng JSON
    .then(response => response.json())
    // Xử lý dữ liệu JSON đã chuyển đổi
    .then(data => {
        // Dùng DOM lấy container
        const container = document.getElementById('productList')
        // Duyệt dữ liệu trong file json
        data.forEach(product => {
            // Tạo thẻ div có class ="product-card" cho mỗi sản phẩm
            const div = document.createElement('div');
            div.classList.add('product-card');
            // Gán thông tin sản phẩm vào thẻ div
            div.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price}</p>
                <p>Mô tả: ${product.description}</p>
            `;
            // Thêm thẻ div vào container
            container.appendChild(div);
        })
    })