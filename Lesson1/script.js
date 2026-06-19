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