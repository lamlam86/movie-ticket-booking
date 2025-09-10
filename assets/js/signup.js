// js/main.js
document.addEventListener('DOMContentLoaded', function () {
    // kiểm tra plugin đã load
    if (typeof window.intlTelInput !== 'function') {
        console.error('intlTelInput chưa load. Kiểm tra CDN / thứ tự <script>.');
        return;
    }

    // init intl-tel-input
    const phoneInput = document.getElementById('phone');
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: 'vn',
        separateDialCode: true,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@17/build/js/utils.js',
        preferredCountries: ['vn', 'us', 'gb', 'au', 'de', 'fr', 'jp', 'kr'],
        autoPlaceholder: 'aggressive',
        nationalMode: false
    });

    // tạo hidden input để submit E.164 (nếu không có)
    let hiddenPhone = document.getElementById('phone_e164');
    const form = document.getElementById('signupForm');
    if (!hiddenPhone) {
        hiddenPhone = document.createElement('input');
        hiddenPhone.type = 'hidden';
        hiddenPhone.name = 'phone_e164';
        hiddenPhone.id = 'phone_e164';
        form.appendChild(hiddenPhone);
    }

    // debug: log khi đổi quốc gia (tùy chọn)
    phoneInput.addEventListener('countrychange', () => {
        console.log('Dial code:', iti.getSelectedCountryData().dialCode);
    });

    // regex chung (dùng trong validate)
    const regex = {
        fullname: /^[\p{L}\s]{2,}$/u,
        username: /^[a-zA-Z0-9_]{4,}$/,
        cccd: /^\d{12}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // hàm toggle password: expose ra window vì dùng onclick inline
    window.togglePassword = function (id) {
        const input = document.getElementById(id);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
    };

    // helper: reset errors
    function resetErrors() {
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => (el.textContent = ''));
    }

    // xử lý submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        resetErrors();

        let valid = true;

        // fullname
        const fullnameEl = document.getElementById('fullname');
        if (!regex.fullname.test(fullnameEl.value.trim())) {
            valid = false;
            fullnameEl.classList.add('error');
            document.getElementById('fullnameError').textContent = 'Họ và tên phải hợp lệ, không chứa số.';
        }

        // username
        const usernameEl = document.getElementById('username');
        if (!regex.username.test(usernameEl.value.trim())) {
            valid = false;
            usernameEl.classList.add('error');
            document.getElementById('usernameError').textContent =
                'Tên đăng nhập tối thiểu 4 ký tự, chỉ chữ/số/_.';
        }

        // dob
        const dobEl = document.getElementById('dob');
        if (!dobEl.value) {
            valid = false;
            dobEl.classList.add('error');
            document.getElementById('dobError').textContent = 'Vui lòng chọn ngày sinh.';
        } else {
            const dobDate = new Date(dobEl.value);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();
            if (dobDate > today || age < 13) {
                valid = false;
                dobEl.classList.add('error');
                document.getElementById('dobError').textContent = 'Ngày sinh không hợp lệ (phải trên 13 tuổi).';
            }
        }

        // cccd
        const cccdEl = document.getElementById('cccd');
        if (!regex.cccd.test(cccdEl.value.trim())) {
            valid = false;
            cccdEl.classList.add('error');
            document.getElementById('cccdError').textContent = 'CCCD phải đủ 12 số.';
        }

        // email
        const emailEl = document.getElementById('email');
        if (!regex.email.test(emailEl.value.trim())) {
            valid = false;
            emailEl.classList.add('error');
            document.getElementById('emailError').textContent = 'Email không hợp lệ.';
        }

        // phone: dùng intl-tel-input
        const phoneVal = phoneInput.value.trim();
        if (phoneVal) {
            if (!iti.isValidNumber()) {
                valid = false;
                phoneInput.classList.add('error');
                document.getElementById('phoneError').textContent =
                    'Số điện thoại không hợp lệ cho quốc gia đã chọn.';
            } else {
                hiddenPhone.value = iti.getNumber(); // E.164
            }
        } else {
            valid = false;
            phoneInput.classList.add('error');
            document.getElementById('phoneError').textContent = 'Vui lòng nhập số điện thoại.';
        }

        // password
        const passEl = document.getElementById('password');
        if (!regex.password.test(passEl.value)) {
            valid = false;
            passEl.classList.add('error');
            document.getElementById('passwordError').textContent =
                'Mật khẩu >=8 ký tự, gồm hoa, thường, số, ký tự đặc biệt.';
        }

        // confirm
        const confirmEl = document.getElementById('confirm-password');
        if (passEl.value !== confirmEl.value) {
            valid = false;
            confirmEl.classList.add('error');
            document.getElementById('confirmPasswordError').textContent = 'Mật khẩu xác nhận không khớp.';
        }

        // policy
        const policyEl = document.getElementById('policy');
        if (!policyEl.checked) {
            valid = false;
            policyEl.classList.add('error');
            document.getElementById('policyError').textContent = 'Bạn phải đồng ý với chính sách.';
        }

        if (valid) {
            // ở đây bạn có thể submit form lên server (fetch/ajax) hoặc cho submit mặc định
            // ví dụ hiện demo: alert và reset form
            alert('Đăng ký thành công!\nSố gửi đi (E.164): ' + hiddenPhone.value);
            form.reset();
            iti.setCountry('vn');
            // xóa hidden phone sau reset
            hiddenPhone.value = '';
        } else {
            console.log('Validation failed');
        }
    });
});
