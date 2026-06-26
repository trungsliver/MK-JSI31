// ========= ÔN TẬP JAVASCRIPT =========
    // Phạm vi biến (variables scope)
        // Global scope: khai báo ngoài function, có thể truy cập ở bất kỳ đâu
let subject = "JavaScript";
var level = 'Intensive';
        // Local scope: khai báo trong function, chỉ truy cập được trong function đó
function showInfo() {
    let school = "MindX"; // local scope
    console.log('Biến global: ', subject, level); 
    console.log('Biến local: ', school);
}
showInfo();

    // Cách đặt tên biến
        // Camel case: myVariableName
        // Snake case: my_variable_name

    // Cách đặt tên hằng số: viết hoa tất cả, dùng snake case:
const API_KEY = 'sample secretkey';
const PI = 3.14;

    // cách đặt tên function: bắt đầu = động từ, camel case: 
function showInfo2() {}
function getItem() {}

    // Arrow function (hàm mũi tên)
        // hàm thông thường
function add(a, b) {
    return a + b;
}

    // Arrow function (hàm mũi tên)
const addArrow = (a, b) => a + b;

    // Arrow function với nhiều dòng lệnh
const multiplyArrow = (a, b) => {
    let result = a * b;
    return result;
}

    // template literals (chuỗi mẫu)
subject = "JavaScript";
level = "Intensive";
name = "Quang Huy";
school = "MindX";

let str1 = `Tôi là ${name}, đang học ${subject} ${level} tại ${school}`;
console.log(str1);

    // Array / List method (advanced)
        // map: duyêt & biến đổi nhiều phần tử
const students1 = ["Quang Huy", 'Xuân Tú', 'Khải Hoàng', 'Đình Hải'];

            // Cách cũ:
const students2 = [];
students1.forEach((student, index) => {
    students2.push(`${student} - JSI31`);
})
console.log('students2: ', students2);

            // Cách mới: dùng map
const students3 = students1.map((student, index) => `${student} - JSI31`);
console.log('students3: ', students3);

        // filter(): lọc theo điều kiện
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const evenNumbers = numbers.filter((number) => number % 2 === 0);
console.log('evenNumbers: ', evenNumbers);

        // find(): tìm phần tử đầu tiên thỏa điều kiện
const firstEvenNumber = numbers.find((number) => number % 2 === 0);
console.log('firstEvenNumber: ', firstEvenNumber);


// ================= BÀI TẬP =================
/*
Bài tập thực hành xử lý dữ liệu điểm của một lớp.
Dưới đây là dữ liệu điểm tổng kết của 10 bạn học sinh ngẫu nhiên trong lớp.

Yêu cầu đề bài: 
1. Lọc danh sách 3 học sinh đạt điểm TBHK cao nhất
2. Tìm học sinh đạt điểm TBHK thấp nhất 
3. Tính điểm trung bình HK của toàn bộ 10 bạn học sinh trong lớp. 
4. In ra tên các học sinh đạt danh hiệu học lực: Giỏi - Khá - Trung Bình
5. Lọc danh sách học sinh có số điểm TBHK >= 7 (chỉ cần hiển thị tên).
*/

const students = [
  {
    name: "An",
    scores: {
      Toan: { score: 7.4, evaluation: "Đ" },
      NguVan: { score: 8.9, evaluation: "Đ" },
      NgoaiNgu: { score: 8.5, evaluation: "Đ" },
      VatLy: { score: 9.0, evaluation: "Đ" },
      HoaHoc: { score: 3.9, evaluation: "KĐ" },
      SinhHoc: { score: 5.0, evaluation: "Đ" },
      LichSu: { score: 8.3, evaluation: "Đ" },
      DiaLy: { score: 9.4, evaluation: "Đ" },
      GDCD: { score: 6.6, evaluation: "Đ" },
    },
  },
  {
    name: "Binh",
    scores: {
      Toan: { score: 3.4, evaluation: "KĐ" },
      NguVan: { score: 5.9, evaluation: "Đ" },
      NgoaiNgu: { score: 5.4, evaluation: "Đ" },
      VatLy: { score: 7.4, evaluation: "Đ" },
      HoaHoc: { score: 9.3, evaluation: "Đ" },
      SinhHoc: { score: 8.6, evaluation: "Đ" },
      LichSu: { score: 5.2, evaluation: "Đ" },
      DiaLy: { score: 7.1, evaluation: "Đ" },
      GDCD: { score: 6.7, evaluation: "Đ" },
    },
  },
  {
    name: "Chi",
    scores: {
      Toan: { score: 5.5, evaluation: "Đ" },
      NguVan: { score: 3.7, evaluation: "KĐ" },
      NgoaiNgu: { score: 3.9, evaluation: "KĐ" },
      VatLy: { score: 8.1, evaluation: "Đ" },
      HoaHoc: { score: 7.4, evaluation: "Đ" },
      SinhHoc: { score: 7.6, evaluation: "Đ" },
      LichSu: { score: 3.9, evaluation: "KĐ" },
      DiaLy: { score: 8.4, evaluation: "Đ" },
      GDCD: { score: 5.2, evaluation: "Đ" },
    },
  },
  {
    name: "Dung",
    scores: {
      Toan: { score: 9.1, evaluation: "Đ" },
      NguVan: { score: 5.5, evaluation: "Đ" },
      NgoaiNgu: { score: 4.4, evaluation: "KĐ" },
      VatLy: { score: 4.6, evaluation: "KĐ" },
      HoaHoc: { score: 6.4, evaluation: "Đ" },
      SinhHoc: { score: 3.2, evaluation: "KĐ" },
      LichSu: { score: 6.3, evaluation: "Đ" },
      DiaLy: { score: 9.4, evaluation: "Đ" },
      GDCD: { score: 8.7, evaluation: "Đ" },
    },
  },
  {
    name: "Em",
    scores: {
      Toan: { score: 7.1, evaluation: "Đ" },
      NguVan: { score: 9.2, evaluation: "Đ" },
      NgoaiNgu: { score: 8.7, evaluation: "Đ" },
      VatLy: { score: 4.4, evaluation: "KĐ" },
      HoaHoc: { score: 6.4, evaluation: "Đ" },
      SinhHoc: { score: 3.0, evaluation: "KĐ" },
      LichSu: { score: 5.0, evaluation: "Đ" },
      DiaLy: { score: 9.8, evaluation: "Đ" },
      GDCD: { score: 7.0, evaluation: "Đ" },
    },
  },
  {
    name: "Phuc",
    scores: {
      Toan: { score: 5.5, evaluation: "Đ" },
      NguVan: { score: 4.7, evaluation: "KĐ" },
      NgoaiNgu: { score: 4.2, evaluation: "KĐ" },
      VatLy: { score: 6.5, evaluation: "Đ" },
      HoaHoc: { score: 3.5, evaluation: "KĐ" },
      SinhHoc: { score: 8.1, evaluation: "Đ" },
      LichSu: { score: 6.4, evaluation: "Đ" },
      DiaLy: { score: 7.0, evaluation: "Đ" },
      GDCD: { score: 8.0, evaluation: "Đ" },
    },
  },
  {
    name: "Giau",
    scores: {
      Toan: { score: 5.8, evaluation: "Đ" },
      NguVan: { score: 6.3, evaluation: "Đ" },
      NgoaiNgu: { score: 3.1, evaluation: "KĐ" },
      VatLy: { score: 9.0, evaluation: "Đ" },
      HoaHoc: { score: 7.4, evaluation: "Đ" },
      SinhHoc: { score: 7.7, evaluation: "Đ" },
      LichSu: { score: 5.5, evaluation: "Đ" },
      DiaLy: { score: 5.3, evaluation: "Đ" },
      GDCD: { score: 5.6, evaluation: "Đ" },
    },
  },
  {
    name: "Hieu",
    scores: {
      Toan: { score: 6.9, evaluation: "Đ" },
      NguVan: { score: 7.7, evaluation: "Đ" },
      NgoaiNgu: { score: 6.3, evaluation: "Đ" },
      VatLy: { score: 3.7, evaluation: "KĐ" },
      HoaHoc: { score: 6.8, evaluation: "Đ" },
      SinhHoc: { score: 6.3, evaluation: "Đ" },
      LichSu: { score: 3.5, evaluation: "KĐ" },
      DiaLy: { score: 7.9, evaluation: "Đ" },
      GDCD: { score: 9.6, evaluation: "Đ" },
    },
  },
  {
    name: "Hoang",
    scores: {
      Toan: { score: 5.5, evaluation: "Đ" },
      NguVan: { score: 7.3, evaluation: "Đ" },
      NgoaiNgu: { score: 7.0, evaluation: "Đ" },
      VatLy: { score: 5.8, evaluation: "Đ" },
      HoaHoc: { score: 7.5, evaluation: "Đ" },
      SinhHoc: { score: 5.2, evaluation: "Đ" },
      LichSu: { score: 7.6, evaluation: "Đ" },
      DiaLy: { score: 3.8, evaluation: "KĐ" },
      GDCD: { score: 9.9, evaluation: "Đ" },
    },
  },
  {
    name: "Khanh",
    scores: {
      Toan: { score: 7.0, evaluation: "Đ" },
      NguVan: { score: 3.7, evaluation: "KĐ" },
      NgoaiNgu: { score: 10.0, evaluation: "Đ" },
      VatLy: { score: 7.7, evaluation: "Đ" },
      HoaHoc: { score: 9.0, evaluation: "Đ" },
      SinhHoc: { score: 4.6, evaluation: "KĐ" },
      LichSu: { score: 6.4, evaluation: "Đ" },
      DiaLy: { score: 6.6, evaluation: "Đ" },
      GDCD: { score: 5.9, evaluation: "Đ" },
    },
  },
];


// 1. Lọc danh sách 3 học sinh đạt điểm TBHK cao nhất
    // Dùng map để tạo ra danh sách học sinh với điểm TBHK
const top3Students = students.map((student) => {
  let totalScore = 0;
  const subjects = Object.values(student.scores);

  // Tính tổng điểm cho từng môn
  for (let i = 0; i < subjects.length; i++) {
    totalScore += subjects[i].score;
  }

  return {
    name: student.name,
    average: totalScore / subjects.length, // Tính điểm trung bình
  };
});

    // Sắp xếp học sinh theo điểm trung bình giảm dần và lấy 3 học sinh đầu tiên
top3Students.sort((a, b) => b.average - a.average);
const top3 = top3Students.slice(0, 3);
    // Hiển thi Kết quả
console.log("3 học sinh đạt điểm TBHK cao nhất:", top3);

// 2. Tìm học sinh đạt điểm TBHK thấp nhất
lowest_stu = top3Students[students.length - 1];  // Phần tử cuối cùng của danh sách
console.log("Học sinh đạt điểm TBHK thấp nhất:", lowest_stu)

// 3. Tính điểm trung bình HK của toàn bộ 10 bạn học sinh trong lớp.
totalAvg = 0;
    // Tính tổng điểm TBHK của toàn bộ hsinh trong dsach
for (let i=0; i < top3Students.length; i++){
    totalAvg += top3Students[i].average
}
// Lấy điểm TBHK trung bình
avg = totalAvg / top3Students.length
console.log("Điểm TBHK trung bình của toàn bộ học sinh:", avg);

// 4. In ra tên các học sinh đạt danh hiệu học lực: Giỏi - Khá - Trung Bình
const hocLuc = top3Students.map((student) =>{
    if (student.average >= 8){
        evaluation = 'Giỏi';
    } else if (student.average >= 6.6){
        evaluation = 'Khá';
    } else {
        evaluation = 'Trung Bình';
    }
    // Trả về tên học sinh và danh hiệu học lực
    return { name: student.name, evaluation };
})  
console.log("Danh sách học sinh đạt danh hiệu học lực:", hocLuc)


// 5. Lọc danh sách học sinh có số điểm TBHK >= 7 (chỉ cần hiển thị tên).
    // Dùng filer()
const stuAbove7 = top3Students.filter(stu => stu.average >= 7);
console.log("Danh sách học sinh có điểm TBHK >= 7:", stuAbove7);