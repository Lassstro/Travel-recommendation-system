document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Lấy giá trị từ các trường của form
        var formData = {
            time: document.getElementById('time').value,
            income: document.getElementById('income').value,
            terrain: document.getElementById('terrain').value,
            purpose: document.getElementById('purpose').value,
            numberOfPeople: document.getElementById('numberOfPeople').value
        };
        // Gửi yêu cầu POST đến API Flask
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý dữ liệu trả về từ API
            displayData(data);
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu:', error);
        });
    });
});

function displayData(data) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';  // Xóa dữ liệu cũ
    const diaDiem = data["Địa điểm"];
    const danhGia = data["Đánh giá"];

    Object.entries(diaDiem).forEach(([key, value]) => {
        // Hiển thị thông tin trên giao diện
        const listItem = document.createElement('li');
        listItem.style.display = 'flex'
        listItem.style.alignItems = 'center';
        // Tạo liên kết Google Tìm kiếm cho Địa điểm và thêm vào mục
        const diaDiemLink = document.createElement('a');
        diaDiemLink.href = `https://www.google.com/search?q=${encodeURIComponent(diaDiem[key])}`;
        diaDiemLink.target = '_blank';
        diaDiemLink.textContent = `${(parseInt(key) + 1)}:  ${diaDiem[key]}`
        diaDiemLink.style.marginRight = '10px';
        listItem.appendChild(diaDiemLink);
    
        const danhGiaElement = document.createElement('div');

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('a');
            star.textContent = i <= danhGia[key] ? '☆' : '☆'; // Sử dụng ký tự hình sao
            star.style.color = i <= danhGia[key] ? 'gold' : 'gray'; // Màu sắc cho sao được đánh giá
            danhGiaElement.appendChild(star);
        }
        listItem.appendChild(danhGiaElement);

        dataList.appendChild(listItem);
    })
}
  