document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Email không hợp lệ.';
        valid = false;
    } else {
        document.getElementById('emailError').textContent = '';
    }

    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Mật khẩu tối thiểu 8 ký tự.';
        valid = false;
    } else {
        document.getElementById('passwordError').textContent = '';
    }

    if (valid) {
        // Xử lý đăng nhập ở đây (gửi request, chuyển trang, ...)
        alert('Đăng nhập thành công!');
    }
});