document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn form gửi yêu cầu mặc định

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
    // Hiển thị dữ liệu trên giao diện HTML
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';  // Ẩn dữ liệu cũ
    data.forEach(item => {
        const listItem = document.createElement('li');

        // Tạo liên kết Google Tìm kiếm và thêm vào mục
        const searchLink = document.createElement('a');
        searchLink.href = `https://www.google.com/search?q=${encodeURIComponent(item)}`;
        searchLink.target = '_blank';
        searchLink.textContent = item;

        listItem.appendChild(searchLink);
        dataList.appendChild(listItem);
    });
}